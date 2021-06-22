import React, { Fragment, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Menu } from 'antd'
import { 
  PieChartOutlined, 
  DesktopOutlined, 
  ContainerOutlined, 
  PaperClipOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons'
import { debounce } from 'lodash-es'
import classnames from 'classnames'
import { Switch, Route, withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from './connect'
import Black from '../BlackUser'
import Friends from '../Friends'
import Room from '../RoomList'
import Recent from '../RecuntUser'
import { history } from '@/utils'
import styles from './index.less'

const { Item } = Menu

const CHAT_ROUTE_MAP = {
  room: '/main/room',
  user: '/main/friends',
  recent: '/main/recent',
  black: '/main/black'
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(memo((props: any) => {

  const [ collapsed, setCollapsed ] = useState<boolean>(false)
  const [ selectedKeys, setSelectedKeys ] = useState<string[]>(['room'])
  
  const MenuList = useMemo(() => {
    return (
      <Fragment>
        <Item key="room" icon={<PieChartOutlined />}>
          聊天室
        </Item>
        <Item key="user" icon={<DesktopOutlined />}>
          好友
        </Item>
        <Item key="recent" icon={<ContainerOutlined />}>
          最近联系人
        </Item>
        <Item key="black" icon={<PaperClipOutlined />}>
          黑名单
        </Item>
      </Fragment>
    )
  }, [])

  const MenuCollButton = useMemo(() => {
    if(collapsed) return MenuUnfoldOutlined
    return MenuFoldOutlined
  }, [collapsed])

  const onMenuChange = useCallback(({ item, key }) => {
    console.log(item, key, '路由跳转')
    setSelectedKeys([key])
    const route = CHAT_ROUTE_MAP[key as keyof typeof CHAT_ROUTE_MAP]
    if(route) history.push(route)
  }, [])

  const resize = useCallback((e?) => {
    const width = document.documentElement.clientWidth
    if(width < 800) {
      setCollapsed(true)
    }else {
      setCollapsed(false)
    }
  }, [])

  useEffect(() => {
    const url = new URL(window.location.href)
    const { pathname } = url
    Object.entries(CHAT_ROUTE_MAP).some(item => {
      const [ key, value ] = item
      if(pathname.includes(value)) {
        setSelectedKeys([key])
        return true 
      }
      return false 
    })
  }, [])

  useEffect(() => {
    const debounceResize = debounce(resize, 500)
    debounceResize()
    window.addEventListener('resize', debounceResize)
    return () => {
      window.removeEventListener('resize', debounceResize)
    }
  }, [])

  useEffect(() => {
    props.connect?.()
  }, [])

  return (
    <div
      className={styles["chat-content"]}
    >
      <div 
        className={styles["chat-transition"]}
        style={{ width: collapsed ? 80 : 230 }}
      >
        <Menu
          selectedKeys={selectedKeys}
          mode="inline"
          // theme="dark"
          inlineCollapsed={collapsed}
          onClick={onMenuChange}
          style={{
            height: '100%'
          }}
        >
          {
            MenuList
          }
        </Menu>
        <MenuCollButton
          onClick={setCollapsed.bind(this, !collapsed)} 
          style={{ position: 'absolute', color: 'gray' }}
          className={styles["fix-button"]}
        />
      </div>
      <div 
        className={classnames(styles["chat-transition"], styles["chat-content"])}
        style={{width: collapsed ? 'calc(100% - 80px)' : 'calc(100% - 230px)'}}
      >
        <Switch>
          <Route component={Black} path="/main/black" />
          <Route component={Friends} path="/main/friends" />
          <Route component={Recent} path="/main/recent" />
          <Route component={Room} path="/main/room" />
          <Redirect from="/main" to="/main/friends" />
        </Switch>
      </div>
    </div>
  )

})))