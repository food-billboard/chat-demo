import React, { Fragment, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Tabs, Empty, List as AntList, Avatar, ConfigProvider, Button } from 'antd'
import { connect } from 'react-redux'
import zhCN from 'antd/es/locale/zh_CN'
import { history } from '@/utils'
import { mapDispatchToProps, mapStateToProps } from './connect'

const { TabPane } = Tabs
const { Item: ListItem } = AntList
const { Meta } = ListItem

interface IProps {
  chatMessageCount?: number 
  groupChatMessageCount?: number 
  systemChatMessageCount?: number 
}

interface IListProps {
  list: any[]
  footer?: React.ReactNode
}

const List = memo((props: IListProps) => {
  
  const { list, footer } = useMemo(() => {
    return props 
  }, [props])

  const goChat = useCallback(() => {
    history.push('/main')
  }, [])

  if(list.length) return (
    <ConfigProvider
      locale={zhCN}
    >
      <Empty 
        description="暂无新消息"
      />
    </ConfigProvider>
  )

  return (
    <AntList
      footer={footer}
      dataSource={list}
      renderItem={item => {
        const { avatar, username, message="" } = item 
        return (
          <ListItem
            // onClick={goChat}
          >
            <Meta
              avatar={<Avatar src={avatar}>{username}</Avatar>}
              title={<a>{item.title}</a>}
              description={message}
            />
          </ListItem>
        )
      }}
    >
    </AntList>
  )

})

const Message = memo((props: IProps) => {

  const [ activeKey, setActiveKey ] = useState<'chat' | 'group_chat' | 'system'>('chat')
  const [ messageList, setMessageList ] = useState<any[]>([])

  const { chatMessageCount, groupChatMessageCount, systemChatMessageCount } = useMemo(() => {
    return props 
  }, [props])

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

  const readMessage = useCallback(() => {
    console.log('读消息')
  }, [])

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
  }, [activeKey])

  const fetchData = useCallback(() => {
    console.log('获取数据详情')
  }, [])

  useEffect(() => {
    fetchData()
  }, [activeKey])
 
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
            list={messageList} 
            footer={footer}
          />
        )
      }
      {
        activeKey === 'group_chat' && (
          <List 
            list={messageList} 
            footer={footer}
          />
        )
      }
      {
        activeKey === 'system' && (
          <List 
            list={messageList} 
            footer={footer}
          />
        )
      }
    </Fragment>
  )

})

export default connect(mapStateToProps, mapDispatchToProps)(Message)