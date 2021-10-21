import React, { Fragment, memo, useCallback, useMemo, useState, useEffect } from 'react'
import { Tabs, List as AntList, Avatar, Badge, Button, Space, message } from 'antd'
import { connect } from 'react-redux'
import Day from 'dayjs'
import { merge } from 'lodash'
import { withTry } from '@/utils'
import { disagreeFriend as disagreeFriendMethod, readMessage as requestReadMessage, agreeFriend as agreeFriendMethod } from '@/utils/socket/request'
import { mapDispatchToProps, mapStateToProps } from './connect'
import { formatRoomInfo } from '../../../RoomList/utils'

const { TabPane } = Tabs
const { Item: ListItem } = AntList
const { Meta } = ListItem

interface IProps {
  chatMessageCount?: number 
  groupChatMessageCount?: number 
  systemChatMessageCount?: number 
  value?: API_CHAT.IGetMessageListData[]
  inviteList?: API_CHAT.IGetInviteFriendListRes[]
  messageList?: (socket: any) => Promise<any>
  userInfo?: STORE_USER.IUserInfo
  currRoom?: API_CHAT.IGetRoomListData
  exchangeRoom?: (socket: any, currentRoom: API_CHAT.IGetRoomListData, isjoin: boolean) => Promise<any>
  [key: string]: any 
}

type TListData = {
  avatar: string 
  username: string 
  message: string 
  media_type: API_CHAT.TMessageMediaType
  _id: string 
  createdAt: string 
  un_read_message_count: number 
  [key: string]: any 
}

interface IListProps {
  list: TListData[]
  footer?: React.ReactNode
  onClick?: (item: TListData) => Promise<any> 
  badge?: (item: TListData) => React.ReactNode
}

const List = memo((props: IListProps) => {
  
  const { list, footer, onClick, badge } = useMemo(() => {
    return props 
  }, [props])

  const goChat = useCallback((item) => {
    onClick?.(item)
  }, [onClick])

  return (
    <AntList
      footer={footer}
      dataSource={list}
      locale={{emptyText: '暂无新消息'}}
      renderItem={item => {
        const { avatar, username, message="", createdAt, un_read_message_count } = item 
        return (
          <ListItem
            onClick={goChat.bind(this, item)}
          >
            <Meta
              avatar={<Avatar src={avatar}>{username}</Avatar>}
              title={<Button type="link">{username}</Button>}
              description={message}
            />
            <div style={{textAlign: 'center'}}>
              {Day(createdAt).format('MM-DD HH:mm:ss')}<br />
              {
                badge?.(item) || <Badge count={un_read_message_count} />
              }
            </div>
          </ListItem>
        )
      }}
    >
    </AntList>
  )

})

const MessageContent = {
  IMAGE: "[图片]",
  VIDEO: "[视频]",
  AUDIO: "[音频]",
}

export function inviteListFilter(list: API_CHAT.IGetInviteFriendListRes[]) {
  return list?.filter(item => item.status === 'TO_AGREE') || []
}

const Message = memo((props: IProps) => {

  const [ activeKey, setActiveKey ] = useState<'chat' | 'group_chat' | 'system' | 'invite'>('chat')
  const [ realChatMessage, setRealChatMessage ] = useState<TListData[]>([])

  const { chatMessage, groupChatMessage, systemChatMessage, socket, inviteList, inviteFriendList, userInfo, messageList, currRoom, exchangeRoom } = useMemo(() => {
    const { value, socket, inviteList, inviteFriendList, userInfo, ...nextProps } = props 
    const { chatMessage, groupChatMessage, systemChatMessage } = (Array.isArray(value) ? value : []).reduce((acc, cur) => {
      const { info, createdAt, _id, type, message_info: { media_type, text }, create_user, un_read_message_count } = cur 
      let defaultData = {
        avatar: info.avatar, 
        username: info.name, 
        message: MessageContent[media_type as keyof typeof MessageContent] || text || '',
        media_type,
        _id,
        createdAt,
        un_read_message_count,
        origin: cur
      }
      switch(type) {
        case 'CHAT':
          acc.chatMessage.push({
            avatar: create_user.avatar, 
            username: create_user.username, 
            message: MessageContent[media_type as keyof typeof MessageContent] || text || '',
            media_type,
            _id,
            createdAt,
            un_read_message_count,
            origin: cur
          })
          break 
        case 'GROUP_CHAT':
          acc.groupChatMessage.push(defaultData)
          break
        case 'SYSTEM':
          acc.systemChatMessage.push(defaultData)
      }
      return acc 
    }, {
      chatMessage: [],
      groupChatMessage: [],
      systemChatMessage: []
    } as {
      [key: string]: IListProps["list"]
    })
    return {
      socket,
      chatMessage,
      groupChatMessage,
      systemChatMessage,
      userInfo,
      inviteList: inviteList?.map(item => {
        return merge({}, item, {
          message: '',
          media_type: 'TEXT' as API_CHAT.TMessageMediaType,
          un_read_message_count: 1
        }) 
      }) || [],
      inviteFriendList,
      ...nextProps
    } 
  }, [props])

  const chatMessageCount = useMemo(() => {
    return realChatMessage.reduce((acc, cur) => {
      acc += cur.un_read_message_count
      return acc 
    }, 0)
  }, [ realChatMessage ])

  const groupChatMessageCount = useMemo(() => {
    return groupChatMessage.reduce((acc, cur) => {
      acc += cur.un_read_message_count
      return acc 
    }, 0)
  }, [groupChatMessage])

  const systemChatMessageCount = useMemo(() => {
    return systemChatMessage.reduce((acc, cur) => {
      acc += cur.un_read_message_count
      return acc 
    }, 0)
  }, [systemChatMessage])

  const inviteListCount = useMemo(() => {
    return inviteListFilter(inviteList)?.length || 0
  }, [inviteList])

  const chatTitle = useMemo(() => {
    return `未读消息(${chatMessageCount || 0})`
  }, [chatMessageCount])

  const groupChatTitle = useMemo(() => {
    return `未读群消息(${groupChatMessageCount || 0})`
  }, [groupChatMessageCount])

  const systemChatTitle = useMemo(() => {
    return `未读系统消息(${systemChatMessageCount || 0})`
  }, [systemChatMessageCount])

  const inviteTitle = useMemo(() => {
    return `好友申请(${inviteListCount})`
  }, [inviteListCount])

  const onTabChange = useCallback((activeKey) => {
    setActiveKey(activeKey)
  }, [])

  const readMessage = useCallback(async () => {
    if(!props.value || !socket) return 
    requestReadMessage(socket, {
      _id: props.value?.map(item => {
        return item._id
      }).join(','),
      type: 1
    })
    await messageList?.(socket)
  }, [socket, props.value, messageList])

  const footer = useMemo(() => {
    return (
      <div
        style={{display: 'flex'}}
      >
        <Button style={{flex: 1}} onClick={readMessage}>全部已读</Button>
      </div>
    )
  }, [readMessage])

  const inviteFooter = useMemo(() => {
    return (
      <div
        style={{display: 'flex'}}
      >
        {/* <Button style={{flex: 1, marginRight: 16}} onClick={readMessage}>全部拒绝</Button>
        <Button style={{flex: 1}} onClick={getDetail}>全部同意</Button> */}
      </div>
    )
  }, [])

  const disagreeFriend = useCallback(async (item: TListData) => {
    const { friend_id } = item
    const [err, ] = await withTry(disagreeFriendMethod)(socket, { _id: friend_id })
    if(err) {
      message.info('网络错误')
    }else {
      await inviteFriendList(socket)
    }
  }, [socket, inviteFriendList])

  const agreeFriend = useCallback(async (item: TListData) => {
    const { friend_id } = item
    const [err, ] = await withTry(agreeFriendMethod)(socket, { _id: friend_id })
    if(err) {
      message.info('网络错误')
    }else {
      await inviteFriendList(socket)
    }
  }, [socket, inviteFriendList])

  const inviteBadge = useCallback((item: TListData) => {
    const { status } = item 
    if(status === 'NORMAL') return '已同意'
    if(status === 'DIS_AGREEED') return '已拒绝'
    if(status === 'AGREE') return '同意了你的好友申请'
    if(status === 'DIS_AGREE') return '拒绝了你的好友申请'
    return (
      <Space size={5}>
        <Button type="link" danger onClick={disagreeFriend.bind(this, item)}>拒绝</Button>
        <Button type="link" onClick={agreeFriend.bind(this, item)}>同意</Button>
      </Space>
    )
  }, [disagreeFriend, agreeFriend])

  const quitRoom = useCallback(async () => {
    if(!!currRoom) await exchangeRoom?.(socket, currRoom, false)
  }, [socket, exchangeRoom, currRoom])

  const onSelectRoom = useCallback(async (item: API_CHAT.IGetRoomListData) => {
    await quitRoom()
    await exchangeRoom?.(socket, item, true)
  }, [socket, exchangeRoom, quitRoom])

  const goRoom = useCallback(async (item: TListData) => {
    const { _id: targetId, avatar, username, origin } = item 
    const { _id: currId } = currRoom || {}
    if(targetId === currId) return 
    onSelectRoom(merge({}, origin, {
      info: {
        avatar,
        name: username
      }
    }))
  }, [currRoom, onSelectRoom])

  const chatRoomMessageFormat = useCallback(async (list: TListData[]) => {
    let newList: TListData[] = []
    for(let i = 0; i < list.length; i ++) {
      const roomData = list[i]
      const prevData = realChatMessage.find(item => item._id === roomData._id)
      if(!!prevData) {
        const { info: prevInfo={}, ...prevPrevData } = prevData
        const { info: nextInfo={}, ...nextPrevData } = roomData
        newList.push(merge({}, prevPrevData, nextPrevData, {
          ...prevInfo,
          ...nextInfo,
          avatar: nextInfo.avatar || prevInfo.avatar
        }))
      }else {
        const newData = await formatRoomInfo({
          info: {
            name: roomData.username,
            avatar: roomData.avatar,
            description: roomData.message
          },
          type: "CHAT",
          _id: roomData._id
        } as any, userInfo!)
        if(newData) {
          const { info: { avatar, name } } = newData
          newList.push(merge({}, roomData, {
            username: name,
            avatar
          }))
        }else {
          newList.push(roomData)
        }
      }
    }
    setRealChatMessage(newList)
  }, [userInfo, realChatMessage])

  useEffect(() => {
    chatRoomMessageFormat(chatMessage)
  }, [chatMessage])
 
  return (
    <Fragment>
      <Tabs
        defaultActiveKey="chat"
        onChange={onTabChange}
        activeKey={activeKey}
        style={{
          padding: '0 20px'
        }}
      >
        <TabPane tab={chatTitle} key="chat" />
        <TabPane tab={groupChatTitle} key="group_chat" />
        <TabPane tab={systemChatTitle} key="system" />
        <TabPane tab={inviteTitle} key="invite" />
      </Tabs>
      {
        activeKey === 'chat' && (
          <List 
            list={realChatMessage} 
            footer={footer}
            onClick={goRoom}
          />
        )
      }
      {
        activeKey === 'group_chat' && (
          <List 
            list={groupChatMessage} 
            footer={footer}
            onClick={goRoom}
          />
        )
      }
      {
        activeKey === 'system' && (
          <List 
            list={systemChatMessage} 
            footer={footer}
            onClick={goRoom}
          />
        )
      }
      {
        activeKey === 'invite' && (
          <List
            footer={inviteFooter}
            list={inviteList}
            badge={inviteBadge}
          />
        )
      }
    </Fragment>
  )

})

export default connect(mapStateToProps, mapDispatchToProps)(Message)