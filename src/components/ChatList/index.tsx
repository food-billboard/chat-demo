import React, { memo, useMemo, FC, Fragment, useEffect, useCallback, useState } from 'react'
import { Avatar } from 'antd'
import { connect } from 'react-redux'
import Day from 'dayjs'
import * as Scroll from 'react-scroll'
import { Link, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import UserDetail from '../UserDetail'
import ImageView from './components/ViewImage'
import ChatInput from '../ChatList'
import { mapStateToProps, mapDispatchToProps } from './connect'
import { IMAGE_FALLBACK } from '@/utils'
import styles from './index.less'

export interface IChatData {
  user: {
    avatar: string 
    _id: string 
    username: string 
    description?: string 
  },
  message: {
    value: string 
    type: 'IMAGE' | 'AUDIO' | 'TEXT' | 'VIDEO'
    poster?: string 
    createdAt: string 
  } 
  isMine?: boolean 
}

export interface IProps {
  value: IChatData[]
  userInfo: STORE_USER.IUserInfo
  fetchData: (params: Partial<{
    currPage: number 
    pageSize: number 
  }>) => Promise<IChatData[]>
}

const ChatData: FC<{
  value: IChatData
}> = memo((props) => {

  const { 
    value: {
      isMine,
      user: {
        avatar,
        _id,
        username,
        description
      },
      message
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
    const {
      value,
      type,
      poster
    } = message
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
          type === 'AUDIO' && '语音消息'
        }
        {
          (type === 'IMAGE' || type === 'VIDEO') && (
            <ImageView
              type={'VIDEO'}
              src={type === 'IMAGE' ? value : (poster || IMAGE_FALLBACK)}
            />
          )
        }
        {
          type === 'TEXT' && value
        }
      </div>
    )
  }, [message, isMine])

  return (
    <div
      className={styles["chat-item-container"]}
    >
      { 
        !!message.createdAt && (
          <div className={styles["chat-item-date"]}>{Day(message.createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
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

const ChatList = memo((props: IProps) => {

  const [ currPage, setCurrPage ] = useState<number>(0)
  // const [ value, setValue ] = useState<IChatData[]>([])

  const { userInfo, fetchData, value } = useMemo(() => {
    return props 
  }, [props])

  const realValue = useMemo(() => {
    const { member } = userInfo
    return value.map(item => {
      const { user } = item
      const { _id } = user
      return {
        ...item,
        isMine: member == _id
      } 
    })
  }, [value, userInfo])

  const internalFetchData = useCallback(async(params: Partial<{ currPage: number, pageSize: number }>) => {
    const value = await fetchData(params)

  }, [])

  const scrollToTop = useCallback(() => {
    scroll.scrollToTop()
  }, [])

  const scrollToBottom = useCallback(() => {
    scroll.scrollToBottom()
  }, [])

  useEffect(() => {
    Events.scrollEvent.register('begin', function(to, element) {
      console.log('begin', arguments)
    })

    Events.scrollEvent.register('end', function(to, element) {
      console.log('end', arguments)
    })

    scrollSpy.update()

    return () => {
      Events.scrollEvent.remove('begin')
      Events.scrollEvent.remove('end')
    }
  }, [])
  
  return (
    <Fragment>
      {
        realValue.map(item => {
          return (
            <ChatData key={item.message.createdAt} value={item} />
          )
        })
      }
    </Fragment>
  )

})

export default connect(mapStateToProps, mapDispatchToProps)(ChatList)

export const GroupChat = memo(() => {

  return (
    <div>
      聊天框组合
      {/* <ChatList />
      <ChatInput/> */}
    </div>
  )

})