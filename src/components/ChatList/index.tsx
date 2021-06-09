import React, { memo, useMemo, FC, Fragment, useEffect, useCallback, useState } from 'react'
import { Avatar } from 'antd'
import { connect } from 'react-redux'
import Day from 'dayjs'
import { merge } from 'lodash-es'
import * as Scroll from 'react-scroll'
import { Link, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import UserDetail from '../UserDetail'
import ChatHeader from '../UserHeader'
import ImageView from './components/ViewImage'
import ChatInput from '../ChatInput'
import ObserverDom from './components/Intersection'
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
  // value: IChatData[]
  style?: React.CSSProperties
  userInfo?: STORE_USER.IUserInfo
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
  const [ value, setValue ] = useState<IChatData[]>([])

  const { userInfo, fetchData, style={} } = useMemo(() => {
    return props 
  }, [props])

  const globalStyle = useMemo(() => {
    return merge({}, { height: '300vh' }, style)
  }, [style])

  const realValue = useMemo(() => {
    const { member } = userInfo || {}
    return value.map(item => {
      const { user } = item
      const { _id } = user
      return {
        ...item,
        isMine: member == _id
      } 
    })
  }, [value, userInfo])

  const internalFetchData = useCallback(async(params: Partial<{ currPage: number, pageSize: number, end: number }>={}) => {
    const value = await fetchData(params)
    setValue(value)
  }, [])

  const scrollToTop = useCallback(() => {
    scroll.scrollToTop()
  }, [])

  const scrollToBottom = useCallback(() => {
    scroll.scrollToBottom()
  }, [])

  useEffect(() => {
    internalFetchData()
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
    <div
      style={globalStyle}
    >
      {
        realValue.map(item => {
          return (
            <ChatData key={item.message.createdAt} value={item} />
          )
        })
      }
      <div 
        style={{marginTop: '200vh'}}
        onClick={() => {
          Scroll.animateScroll.scrollMore(10)
        }}
      >11111</div>
    </div>
  )

})

export default connect(mapStateToProps, mapDispatchToProps)(ChatList)

interface IGroupProps extends IProps{

}

export const GroupChat = memo((props: IGroupProps) => {

  const [ isFirstFetch, setIsFirstFetch ] = useState(true)

  const internalFetchData = useCallback((fetch: any) => {
    return async (...args: any[]) => {
      const data = await fetch(...args)
      return data 
    }
  }, [])

  const { ...nextProps } = useMemo(() => {
    const { style, fetchData, ...nextProps } = props 
    return merge({}, nextProps, { 
      style: merge({}, style, 
        {
        paddingBottom: '30vh'
      }),
      fetchData: internalFetchData(fetchData)
    }) 
  }, [props, internalFetchData])

  const onBack = useCallback(() => {
    console.log('返回哈哈哈哈')
  }, [])

  const ChatHeaderDom = useMemo(() => {
    return (
      <ChatHeader 
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'rgb(236, 239, 243)',
          zIndex: 1
        }} 
        title={"用户民"}
        subTitle={""}
        onBack={onBack}
      />
    )
  }, [onBack])

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
        <ObserverDom />
        <ChatList {...nextProps} />
      </div>
      <ChatInput style={{height: '30vh'}} />
    </div>
  )

})