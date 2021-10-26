import React, { memo, useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Space, Button, Badge, Avatar, Menu, Dropdown, Tooltip } from 'antd'
import { BellOutlined } from '@ant-design/icons'
import { withRouter } from 'react-router'
import { history } from '@/utils'
import Message, { inviteListFilter } from './components/message'
import { mapDispatchToProps, mapStateToProps } from './connect'
import { LOGO } from './constants'
import styles from './index.less'

const Title = memo((props: any) => {

  const { isLogin, userInfo={}, logout: fetchLogout, messageCount } = useMemo(() => {
    const { userInfo, value, inviteList } = props
    const inviteListCount = inviteListFilter(inviteList)?.length || 0
    return {
      ...props,
      isLogin: !!userInfo && !!userInfo._id,
      messageCount: (Array.isArray(value) ? value : []).reduce((acc, cur) => {
        acc += (cur.un_read_message_count || 0)
        return acc 
      }, 0) + inviteListCount
    } 
  }, [props])

  const logout = useCallback(async () => {
    await fetchLogout()
    history.replace('/login')
  }, [fetchLogout])

  const userInfoSet = useCallback(async () => {
    history.push('/setting')
  }, [])

  const DropDownOverlay = useMemo(() => {
    return (
      <Menu>
        <Menu.Item
          key="logout"
        >
          <Button type="link" onClick={logout}>退出登录</Button>
        </Menu.Item>
        <Menu.Item
          key="setting"
        >
          <Button type="link" onClick={userInfoSet}>个人信息设置</Button>
        </Menu.Item>
      </Menu>
    )
  }, [logout, userInfoSet])

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
              <img onClick={goIndex} src={LOGO} alt="快乐" />
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
                      count={messageCount}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Title))