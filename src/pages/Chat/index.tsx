import React, { Fragment, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Row, Col, Menu } from 'antd'
import { 
  PieChartOutlined, 
  DesktopOutlined, 
  ContainerOutlined, 
  PaperClipOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons'
import { debounce } from 'lodash-es'
import { Switch, Route, withRouter } from 'react-router-dom'
import Black from '../BlackUser'
import styles from './index.less'

const { Item } = Menu

export default withRouter(memo(() => {

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
    console.log('检查当前路由')
  }, [])

  useEffect(() => {
    const debounceResize = debounce(resize, 500)
    debounceResize()
    window.addEventListener('resize', debounceResize)
    return () => {
      window.removeEventListener('resize', debounceResize)
    }
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
        className={styles["chat-transition"]}
        style={{width: collapsed ? 'calc(100% - 80px)' : 'calc(100% - 230px)'}}
      >
        <Switch>
          {/* <Route component={Black} path="/black" /> */}
          <Black />
        </Switch>
      </div>
    </div>
  )

}))