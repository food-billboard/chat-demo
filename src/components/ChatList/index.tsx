import React, { memo, useMemo, FC, useCallback, useState, forwardRef } from 'react'
import { Avatar } from 'antd'
import { connect } from 'react-redux'
import Day from 'dayjs'
import { merge } from 'lodash-es'
import scrollIntoView from 'scroll-into-view-if-needed'
import { PageHeaderProps } from 'antd/es/page-header'
import UserDetail from '../UserDetail'
import ChatHeader from '../UserHeader'
import ImageView from './components/ViewImage'
import ChatInput from '../ChatInput'
import ObserverDom from './components/Intersection'
import { mapStateToProps, mapDispatchToProps } from './connect'
import { IMAGE_FALLBACK } from '@/utils'
import styles from './index.less'
import { useImperativeHandle } from 'react'
import { useRef } from 'react'

type TMessageValue = API_CHAT.IGetMessageDetailData & { isMine?: boolean }

export interface IProps {
  value: TMessageValue[]
  style?: React.CSSProperties
  loading?: boolean 
  userInfo?: STORE_USER.IUserInfo
  fetchData: (params: Partial<{
    currPage: number 
    pageSize: number 
  }>) => Promise<void>
}

const ChatData: FC<{
  value: TMessageValue
}> = memo((props) => {

  const { 
    value: {
      isMine,
      user_info: {
        avatar,
        _id,
        username,
        description
      },
      media_type,
      content,
      createdAt
    } 
  } = useMemo(() => {
    return props 
  }, [props])

  const UserAvatar = useMemo(() => {
    const UserAvatar = (
      <Avatar shape="square" src={avatar}>{username}</Avatar>
    )
    if(isMine) return UserAvatar
    return (
      <UserDetail
        value={{
          avatar,
          username,
          description,
          _id
        }}
      >
        {UserAvatar}
      </UserDetail>
    )
  }, [avatar, username, isMine, description, _id])

  const PopoverMessage = useMemo(() => {
    const { poster, image, text } = content 
    const margin = isMine ? { marginRight: 20 } : { marginLeft: 20 }
    return (
      <div
        className={styles["popover-chat"]}
        style={{
          ...margin,
          maxWidth: 'calc(100% - 84px)',
          backgroundColor: isMine ? 'rgb(28, 184, 78)' : 'white'
        }}
      >
        {
          media_type === 'AUDIO' && '语音消息'
        }
        {
          (media_type === 'IMAGE' || media_type === 'VIDEO') && (
            <ImageView
              type={'VIDEO'}
              src={media_type === 'IMAGE' ? image! : (poster || IMAGE_FALLBACK)}
            />
          )
        }
        {
          media_type === 'TEXT' && text!
        }
      </div>
    )
  }, [media_type, content, isMine])

  return (
    <div
      className={styles["chat-item-container"]}
    >
      { 
        !!createdAt && (
          <div className={styles["chat-item-date"]}>{Day(createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
        ) 
      }
      <div
        className={styles["chat-item-content"]}
        style={{justifyContent: isMine ? 'flex-end' : 'flex-start'}}
      >
        {
          isMine ? [PopoverMessage, UserAvatar] : [UserAvatar, PopoverMessage]
        }
      </div>
    </div>
  )

})

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
    const { member } = userInfo || {}
    return (value || []).map(item => {
      const { user_info } = item
      const { _id } = user_info
      return {
        ...item,
        isMine: member === _id
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

interface IGroupProps extends IProps{
  header: Partial<PageHeaderProps>
}

export const GroupChat = memo((props: IGroupProps) => {

  const { header, ...nextProps } = useMemo(() => {
    const { style, ...nextProps } = props 
    return merge({}, nextProps, { 
      style: merge({}, style, 
        {
        paddingBottom: '30vh'
      }),
    }) 
  }, [props])

  const listRef = useRef<IChatListRef>(null)

  const onFetchData = useCallback(async () => {
    await listRef.current?.fetchData()
  }, [])

  const onBack = useCallback(() => {
    console.log('返回哈哈哈哈', header)
  }, [header])

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
  }, [onBack, header])

  return (
    <div style={{height: '100%', overflow: 'auto'}}>
      <div
        style={{
          height: 'calc(100% - 30vh)',
          overflow: 'auto'
        }}
        id="chat-list-wrapper"
      >
        {ChatHeaderDom}
        <ObserverDom onObserve={onFetchData} />
        <ChatList ref={listRef} {...nextProps}  />
      </div>
      <ChatInput style={{height: '30vh'}} />
    </div>
  )

})