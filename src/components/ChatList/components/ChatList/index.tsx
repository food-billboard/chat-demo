import React, { memo, useMemo, useCallback, useState, forwardRef, useImperativeHandle } from 'react'
import { connect } from 'react-redux'
import scrollIntoView from 'scroll-into-view-if-needed'
import { merge } from 'lodash-es'
import { mapStateToProps, mapDispatchToProps } from './connect'
import ChatData, { IProps } from '../ChatData'

export interface IChatListRef {
  fetchData: (params?: any, toBottom?: boolean) => Promise<any>
}

const ChatList = memo(forwardRef<IChatListRef, IProps>((props, ref) => {

  const [ currPage, setCurrPage ] = useState<number>(0)
  const [ bottomNode, setBottomNode ] = useState<Element>()

  const { userInfo, fetchData, style={}, value, loading } = useMemo(() => {
    return props 
  }, [props])

  useImperativeHandle(ref, () => {
    return {
      fetchData: internalFetchData
    }
  }, [])

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
      await new Promise((resolve) => setTimeout(resolve, 1000))
      scrollToBottom()
    }
  }, [scrollToBottom, loading, fetchData, currPage])
  
  return (
    <div
      style={globalStyle}
      id="chat-list-container"
    >
      {
        realValue.map(item => {
          return (
            <ChatData key={item.createdAt} value={item} />
          )
        })
      }
      <div id="chat-item-bottom"></div>
    </div>
  )

}))

export default connect(mapStateToProps, mapDispatchToProps)(ChatList)