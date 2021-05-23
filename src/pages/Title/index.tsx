import React, { memo, useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Space, Button, Badge, Avatar, Image, Menu, Dropdown } from 'antd'
import { BellOutlined } from '@ant-design/icons'
import { IMAGE_FALLBACK, history } from '@/utils'
import { mapDispatchToProps, mapStateToProps } from './connect'
import styles from './index.less'

const Title = memo((props: any) => {

  const { isLogin, userInfo, logout: fetchLogout } = useMemo(() => {
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

  const fetchMessage = useCallback(() => {
    history.push('/main')
  }, [])

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
  
  return (
    <div
      className={styles["page-title"]}
    >
      {
        isLogin && (
          <div className={styles["page-title-container"]}>
            <Space>
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
                  <Button onClick={fetchMessage} type="link" icon={<BellOutlined />} />
                </Badge>
              </div>
              <Dropdown
                overlay={DropDownOverlay}
              >
                <div className={`${styles["page-title-user"]} ${styles["page-title-hover"]}`}>
                  <Avatar size={30} src={<Image preview={false} src={userInfo.avatar} fallback={IMAGE_FALLBACK} />}>{userInfo.username}</Avatar>
                  <div className={styles["page-title-user-title"]}>{userInfo.username}</div>
                </div>
              </Dropdown>
            </Space>
          </div>
        )
      }
    </div>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(Title)