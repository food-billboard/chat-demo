import React, { forwardRef, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { List, Avatar, Skeleton, Image, Tooltip, Button, Popover, PopoverProps } from 'antd'
import { unstable_batchedUpdates } from 'react-dom'
import { merge } from 'lodash-es'
import { UserOutlined } from '@ant-design/icons'
import UserDetail from './components/UserDetail'
import { IMAGE_FALLBACK } from '@/utils'
import styles from './index.less'

interface IProps {
  fetchData:() => Promise<API_USER.IGetUserListData[]>
  actions?: (data: API_USER.IGetUserListData) => React.ReactNode[]
  userAction?: (data: API_USER.IGetUserListData) => any
}

interface IUserListRef {

}

const UserList = memo(forwardRef<IUserListRef, IProps>((props, ref) => {

  const [ loading, setLoading ] = useState<boolean>(true)
  const [ list, setList ] = useState<API_USER.IGetUserListData[]>([])

  const { fetchData, actions, userAction } = useMemo(() => {
    return props 
  }, [props])

  const internalFetchData = useCallback(async () => {
    setLoading(true)
    const data = await fetchData()
    unstable_batchedUpdates(() => {
      setList(data)
      setLoading(false)
    })
  }, [fetchData])

  useEffect(() => {
    internalFetchData()
  }, [internalFetchData])

  return (
    <List
      className={styles["demo-loadmore-list"]}
      loading={loading}
      itemLayout="horizontal"
      // loadMore={loadMore}
      dataSource={list}
      renderItem={item => {
        const { avatar, username, description, _id } = item 
        const actionsNode = actions?.(item) || []
        return (
          <List.Item
            key={_id}
            actions={actionsNode}
          >
            <Skeleton avatar title={false} loading={false} active>
              <List.Item.Meta
                avatar={
                  <Avatar src={
                    <Image src={avatar} preview={false} fallback={IMAGE_FALLBACK} />
                  } >{username}</Avatar>
                }
                title={
                  <Tooltip
                    title={
                      <UserDetail />
                    }
                  >
                    <a className={styles["user-list-username"]} onClick={userAction?.bind(this, item)}>{username}</a>
                  </Tooltip>
                }
                description={description}
              />
              {/* <div>content</div> */}
            </Skeleton>
          </List.Item>
        )
      }}
    />
  )

}))

interface IWrapperProps extends IProps {
  popover?: Partial<PopoverProps>
  style?: React.CSSProperties
}

export default memo((props: IWrapperProps) => {

  const { popover, style={}, ...nextProps } = useMemo(() => {
    return props
  }, [props])

  const UserListContent = useMemo(() => {
    return (
      <UserList {...nextProps} />
    )
  }, [nextProps])

  return (
    <Popover
      placement="rightBottom"
      title="好友列表"
      content={UserListContent}
      trigger="click"
      {...popover}
    >
      <Button shape="circle" style={merge({}, { position: 'absolute', zIndex: 2, right: 12, top: '20vh' }, style)} icon={<UserOutlined />}></Button>
    </Popover>
  )

})