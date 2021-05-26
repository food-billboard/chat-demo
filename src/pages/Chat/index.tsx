import React, { Fragment, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Row, Col, Menu, Button } from 'antd'
import { 
  PieChartOutlined, 
  DesktopOutlined, 
  ContainerOutlined, 
  PaperClipOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons'
import { Switch, Route, withRouter } from 'react-router-dom'
import Black from '../BlackUser'

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
  }, [])

  useEffect(() => {
    console.log('检查当前路由')
  }, [])

  return (
    <Row
      gutter={24}
    >
      <Col span={6}>
        <Menu
          selectedKeys={selectedKeys}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          onClick={onMenuChange}
        >
          {
            MenuList
          }
        </Menu>
        <Button 
          type="primary" 
          onClick={setCollapsed.bind(this, !collapsed)} 
          style={{ marginBottom: 16 }}
        >
          {
            React.createElement(MenuCollButton)
          }
        </Button>
      </Col>
      <Col span={18}>
        <Switch>
          <Route component={Black} path="/black" />
        </Switch>
      </Col>
    </Row>
  )

}))