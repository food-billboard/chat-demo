import React, { Fragment, memo, useCallback, useMemo, useState } from 'react'
import { Tabs, List as AntList, Avatar, Badge, Button } from 'antd'
import { connect } from 'react-redux'
import Day from 'dayjs'
import { history } from '@/utils'
import { readMessage as requestReadMessage } from '@/utils/socket/request'
import { mapDispatchToProps, mapStateToProps } from './connect'

const { TabPane } = Tabs
const { Item: ListItem } = AntList
const { Meta } = ListItem

interface IProps {
  chatMessageCount?: number 
  groupChatMessageCount?: number 
  systemChatMessageCount?: number 
  value?: API_CHAT.IGetMessageListData[]
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
}

const List = memo((props: IListProps) => {
  
  const { list, footer, onClick } = useMemo(() => {
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
              title={<a>{username}</a>}
              description={message}
            />
            <div style={{textAlign: 'center'}}>
              {Day(createdAt).format('MM-DD HH:mm:ss')}<br />
              <Badge count={un_read_message_count} />
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

const Message = memo((props: IProps) => {

  const [ activeKey, setActiveKey ] = useState<'chat' | 'group_chat' | 'system'>('chat')

  const { chatMessage, groupChatMessage, systemChatMessage, socket } = useMemo(() => {
    const { value, socket } = props 
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
            un_read_message_count
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
      systemChatMessage
    } 
  }, [props])

  const chatMessageCount = useMemo(() => {
    return chatMessage.reduce((acc, cur) => {
      acc += cur.un_read_message_count
      return acc 
    }, 0)
  }, [ chatMessage ])

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

  const chatTitle = useMemo(() => {
    return `未读消息(${chatMessageCount || 0})`
  }, [chatMessageCount])

  const groupChatTitle = useMemo(() => {
    return `未读群消息(${groupChatMessageCount || 0})`
  }, [groupChatMessageCount])

  const systemChatTitle = useMemo(() => {
    return `未读系统消息(${systemChatMessageCount || 0})`
  }, [systemChatMessageCount])

  const onTabChange = useCallback((activeKey) => {
    setActiveKey(activeKey)
  }, [])

  const readMessage = useCallback(async () => {
    console.log('读消息', socket, props.value)
    if(!props.value || !socket) return 
    requestReadMessage(socket, {
      _id: props.value?.map(item => {
        return item._id
      }).join(','),
      type: 1
    })
  }, [socket, props.value])

  const getDetail = useCallback(() => {
    history.push('/main')
  }, [])

  const footer = useMemo(() => {
    return (
      <div
        style={{display: 'flex'}}
      >
        <Button style={{flex: 1, marginRight: 16}} onClick={readMessage}>全部已读</Button>
        <Button style={{flex: 1}} onClick={getDetail}>查看更多</Button>
      </div>
    )
  }, [getDetail, readMessage])

  const goRoom = useCallback(async (item: TListData) => {

  }, [])
 
  return (
    <Fragment>
      <Tabs
        defaultActiveKey="chat"
        onChange={onTabChange}
        accessKey={activeKey}
        style={{
          padding: '0 20px'
        }}
      >
        <TabPane tab={chatTitle} key="chat" />
        <TabPane tab={groupChatTitle} key="group_chat" />
        <TabPane tab={systemChatTitle} key="system" />
      </Tabs>
      {
        activeKey === 'chat' && (
          <List 
            list={chatMessage} 
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
    </Fragment>
  )

})

export default connect(mapStateToProps, mapDispatchToProps)(Message)