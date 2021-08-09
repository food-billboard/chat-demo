import React, { memo, useMemo, useCallback, useState, forwardRef, useImperativeHandle, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import scrollIntoView from 'scroll-into-view-if-needed'
import { merge } from 'lodash-es'
import { sleep, withTry } from '@/utils'
import { readMessage as readMessageRequest } from '@/utils/socket'
import { mapStateToProps, mapDispatchToProps } from './connect'
import ChatData, { IProps, TMessageValue, VideoModal, VideoModalRef } from '../ChatData'

export interface IChatListRef {
  fetchData: (params?: any, toBottom?: boolean) => Promise<any>
  scrollToBottom: () => void 
}

const ChatList = memo(forwardRef<IChatListRef, IProps & {
  socket?: any,
  currRoom?: API_CHAT.IGetRoomListData
}>((props, ref) => {

  let prevValueLength = useRef(-1)
  const videoRef = useRef<VideoModalRef>(null)

  const [ currPage, setCurrPage ] = useState<number>(0)
  const [ bottomNode, setBottomNode ] = useState<Element>()

  const { userInfo, fetchData, style={}, value, loading, socket, currRoom } = useMemo(() => {
    return props 
  }, [props])

  const globalStyle = useMemo(() => {
    return merge({}, style)
  }, [style])

  const realValue = useMemo(() => {
    const { _id } = userInfo || {}
    return (value || []).map(item => {
      const { user_info } = item
      const { _id: messageUserId } = user_info
      return {
        ...item,
        isMine: messageUserId === _id
      } 
    })
  }, [value, userInfo])

  const getNode = useCallback(() => {
    const node = document.querySelector("#chat-item-bottom")
    if(node) setBottomNode(node)
    return node 
  }, [])

  const readMessage = useCallback((_: TMessageValue[], socket: any, currRoom: API_CHAT.IGetRoomListData) => {
    withTry(readMessageRequest)(socket, {
      _id: currRoom?._id,
      type: 1
    })
  }, [])

  const scrollToBottom = useCallback(() => {
    let node: any = bottomNode
    if(!node) node = getNode()
    if(node) scrollIntoView(node, {
      scrollMode: 'if-needed',
      block: 'nearest',
      inline: 'nearest',
      behavior: 'smooth'
    })
  }, [bottomNode, getNode])

  const internalFetchData = useCallback(async(params: Partial<{ currPage: number, pageSize: number, start: number }>={}, toBottom: boolean=false) => {
    if(loading) return 
    await fetchData(merge({ currPage, pageSize: 10 }, params))
    setCurrPage(prev => prev + 1)
    if(toBottom) {
      await sleep(1000)
      scrollToBottom()
    }
  }, [scrollToBottom, loading, fetchData, currPage])

  const handleViewVideo = useCallback(async (src) => {
    videoRef.current?.open(src)
  }, [videoRef])

  useImperativeHandle(ref, () => {
    return {
      fetchData: internalFetchData,
      scrollToBottom
    }
  }, [scrollToBottom, internalFetchData])

  useEffect(() => {
    let currentLength = value.length
    if(currentLength !== prevValueLength.current) readMessage(value, socket, currRoom!)
    return () => {
      prevValueLength.current = currentLength
    }
  }, [value, currRoom, socket])
  
  return (
    <div
      style={globalStyle}
      id="chat-list-container"
    >
      {
        realValue.map(item => {
          return (
            <ChatData key={item.createdAt} value={item} onVideoView={handleViewVideo} />
          )
        })
      }
      <div id="chat-item-bottom"></div>
      <VideoModal ref={videoRef} />
    </div>
  )

}))

export default connect(mapStateToProps, mapDispatchToProps)(ChatList)