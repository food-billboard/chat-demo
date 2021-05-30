import React, { memo, useMemo, FC, Fragment } from 'react'
import { Avatar } from 'antd'
import { connect } from 'react-redux'
import Day from 'dayjs'
import UserDetail from '../UserDetail'
import { mapStateToProps, mapDispatchToProps } from './connect'
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
        trigger="click"
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
            '图片视频消息'
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

  const { value, userInfo } = useMemo(() => {
    return props 
  }, [props])

  const realValue = useMemo(() => {
    const { member } = userInfo
    return value.map(item => {
      const { user } = item
      const { _id } = user
      return {
        ...item,
        // isMine: member == _id
      } 
    })
  }, [value, userInfo])
  
  return (
    <Fragment>
      {
        realValue.map(item => {
          return (
            <ChatData value={item} />
          )
        })
      }
    </Fragment>
  )

})

export default connect(mapStateToProps, mapDispatchToProps)(ChatList)