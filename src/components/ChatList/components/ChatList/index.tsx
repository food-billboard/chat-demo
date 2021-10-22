import React, { useMemo, useCallback, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { merge } from 'lodash-es'
import { withTry } from '@/utils'
import { readMessage as readMessageRequest } from '@/utils/socket'
import { mapStateToProps, mapDispatchToProps } from './connect'
import ChatData, { IProps, TMessageValue, VideoModal, VideoModalRef } from '../ChatData'

const ChatList = (props: IProps & {
  socket?: any,
  currRoom?: API_CHAT.IGetRoomListData
}) => {

  let prevValueLength = useRef(-1)
  const videoRef = useRef<VideoModalRef>(null)

  const { userInfo, style={}, value, socket, currRoom } = props

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

  const readMessage = useCallback((_: TMessageValue[], socket: any, currRoom: API_CHAT.IGetRoomListData) => {
    withTry(readMessageRequest)(socket, {
      _id: currRoom?._id,
      type: 1
    })
  }, [])

  const handleViewVideo = useCallback(async (src) => {
    videoRef.current?.open(src)
  }, [videoRef])

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
            <ChatData key={item._id} value={item} onVideoView={handleViewVideo} />
          )
        })
      }
      <VideoModal ref={videoRef} />
    </div>
  )

}

export default connect(mapStateToProps, mapDispatchToProps)(ChatList)