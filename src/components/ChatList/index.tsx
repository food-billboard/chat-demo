import React, { memo, useMemo, useCallback, useRef, forwardRef } from 'react'
import { message } from 'antd'
import { connect } from 'react-redux'
import { merge, noop } from 'lodash-es'
import { PageHeaderProps } from 'antd/es/page-header'
import { IProps, TMessageValue } from './components/ChatData'
import ChatList, { IChatListRef } from './components/ChatList'
import ChatHeader from '../UserHeader'
import ChatInput from '../ChatInput'
import ObserverDom from './components/Intersection'
import { postMessage } from '@/utils/socket'
import { getMessageDetail } from '@/services'
import { mapStateToProps, mapDispatchToProps } from './connect'
import { withTry } from '@/utils'
import { useImperativeHandle } from 'react'

export interface IGroupProps extends Omit<IProps, "value">{
  header: Partial<PageHeaderProps>
  currentRoom?: API_CHAT.IGetRoomListData
  socket?: any 
  fetchLoading?: boolean 
  messageListDetailSave?: (value: any, insert: { insertBefore?: boolean, insertAfter?: boolean }) => Promise<void>
  value?: TMessageValue[] 
}

export interface IGroupChatRef {
  scrollToBottom: () => void 
}

const GroupChat = memo(forwardRef<IGroupChatRef, IGroupProps>((props, ref) => {

  const { currentRoom, socket, fetchLoading, messageListDetailSave, value=[], ...nextProps } = useMemo(() => {
    const { style, ...nextProps } = props 
    return merge({}, nextProps, { 
      style: merge({}, style, 
        {
        paddingBottom: '30vh'
      }),
    }) 
  }, [props])

  const header = useMemo(() => {
    return props.header
  }, [props.header])

  const listRef = useRef<IChatListRef>(null)

  const onFetchData = useCallback(async () => {
    await listRef.current?.fetchData()
  }, [])

  const onBack = useCallback((e) => {
    header.onBack?.(e)
  }, [header])

  const handlePostMessage = useCallback(async (value) => {
    let params: API_CHAT.IPostMessageParams = merge({}, value, {
      _id: currentRoom?._id
    })
    const [err, res] = await withTry(postMessage)(socket, params)
    if(err) {
      message.info('消息发送失败')
    }else {
      const newData = await getMessageDetail({
        messageId: res,
        _id: currentRoom!._id
      })
      await messageListDetailSave?.(newData, {
        insertAfter: true 
      })
    }
  }, [currentRoom, socket, onFetchData, messageListDetailSave])

  const ChatHeaderDom = useMemo(() => {
    return (
      <ChatHeader 
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'rgb(236, 239, 243)',
          zIndex: 1
        }} 
        title={"用户名"}
        subTitle={""}
        {...header}
        onBack={onBack}
      />
    )
  }, [header, onBack])

  useImperativeHandle(ref, () => {
    return {
      scrollToBottom: listRef.current?.scrollToBottom || noop
    }
  }, [listRef])

  return (
    <div  
      style={{height: '100%', overflow: 'auto'}}
      // loading={!!loading}
    >
      <div
        style={{
          height: 'calc(100% - 30vh)',
          overflow: 'auto'
        }}
        id="chat-list-wrapper"
      >
        {ChatHeaderDom}
        <ObserverDom onObserve={onFetchData} />
        <ChatList ref={listRef} loading={!!fetchLoading} {...nextProps} value={value} />
      </div>
      <ChatInput style={{height: '30vh', visibility: currentRoom?.type === 'SYSTEM' ? 'hidden' : 'visible' }} onPostMessage={handlePostMessage} />
    </div>
  )

}))

export default connect(mapStateToProps, mapDispatchToProps)(GroupChat)