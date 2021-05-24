import React, { memo, useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Space, Button, Badge, Avatar, Menu, Dropdown, Tooltip } from 'antd'
import { BellOutlined } from '@ant-design/icons'
import { history } from '@/utils'
import Message from './components/message'
import { mapDispatchToProps, mapStateToProps } from './connect'
import { LOGO } from './constants'
import styles from './index.less'

const Title = memo((props: any) => {

  const { isLogin, userInfo={}, logout: fetchLogout } = useMemo(() => {
    const { userInfo } = props
    return {
      ...props,
      isLogin: !!userInfo && !!userInfo._id
    } 
  }, [props])

  const logout = useCallback(async () => {
    await fetchLogout()
    history.replace('/login')
  }, [fetchLogout])

  const DropDownOverlay = useMemo(() => {
    return (
      <Menu>
        <Menu.Item>
          <a onClick={logout}>
            退出登录
          </a>
        </Menu.Item>
      </Menu>
    )
  }, [userInfo])

  const goIndex = useCallback(() => {
    history.push('/home')
  }, [])
  
  return (
    <div
      className={styles["page-title"]}
    >
      {
        isLogin && (
          <div className={styles["page-title-container"]}>
            <div
              className={styles["page-title-log"]}
            >
              <img onClick={goIndex} src={LOGO} />
            </div>
            <div>
              <Space>
                <Tooltip
                  title={<Message />}
                  trigger="click"
                  overlayStyle={{
                    maxWidth: 500
                  }}
                  color="white"
                >
                  <div
                    style={{
                      boxSizing: 'border-box'
                    }}
                    className={styles["page-title-hover"]}
                  >
                    <Badge
                      offset={[0, 5]}
                      count={10}
                      size={"small"}
                    >
                      <Button type="link" icon={<BellOutlined />} />
                    </Badge>
                  </div>
                </Tooltip>
                <Dropdown
                  overlay={DropDownOverlay}
                >
                  <div className={`${styles["page-title-user"]} ${styles["page-title-hover"]}`}>
                    <Avatar size={30} src={userInfo.avatar}>{userInfo.username}</Avatar>
                    <div className={styles["page-title-user-title"]}>{userInfo.username}</div>
                  </div>
                </Dropdown>
              </Space>
            </div>
          </div>
        )
      }
    </div>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(Title)