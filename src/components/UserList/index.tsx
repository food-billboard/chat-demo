import React, { CSSProperties, forwardRef, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { List, Avatar, Skeleton, Image, Tooltip, Button, Popover, PopoverProps } from 'antd'
import { unstable_batchedUpdates } from 'react-dom'
import { merge } from 'lodash-es'
import { UserOutlined } from '@ant-design/icons'
import { ListProps } from 'antd/es/list'
import UserDetail from './components/UserDetail'
import { IMAGE_FALLBACK } from '@/utils'
import styles from './index.less'

export interface IProps extends ListProps<API_USER.IGetUserListData> {
  fetchData:() => Promise<API_USER.IGetUserListData[]>
  actions?: (data: API_USER.IGetUserListData) => React.ReactNode[]
  userAction?: (data: API_USER.IGetUserListData) => any
  style?: CSSProperties
}

interface IUserListRef {

}

export const UserList = memo(forwardRef<IUserListRef, IProps>((props, ref) => {

  const [ loading, setLoading ] = useState<boolean>(true)
  const [ list, setList ] = useState<API_USER.IGetUserListData[]>([])

  const { fetchData, actions, userAction, style={}, ...nextProps } = useMemo(() => {
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
      style={style}
      loading={loading}
      itemLayout="horizontal"
      dataSource={list}
      locale={{emptyText: '暂无好友'}}
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
      {...nextProps}
    />
  )

}))