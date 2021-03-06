import React, { CSSProperties, forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { List, Avatar, Skeleton } from 'antd'
import { unstable_batchedUpdates } from 'react-dom'
import { ListProps } from 'antd/es/list'
import styles from './index.less'

export interface IProps extends ListProps<API_USER.IGetFriendsRes> {
  fetchData:() => Promise<API_USER.IGetFriendsRes[]>
  actions?: (data: API_USER.IGetFriendsRes) => React.ReactNode[]
  userAction?: (data: API_USER.IGetFriendsRes) => any
  style?: CSSProperties
}

export interface IUserListRef {
  fetchData: () => Promise<void>
}

export const UserList = memo(forwardRef<IUserListRef, IProps>((props, ref) => {

  const [ loading, setLoading ] = useState<boolean>(true)
  const [ list, setList ] = useState<API_USER.IGetFriendsRes[]>([])

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

  useImperativeHandle(ref, () => {
    return {
      fetchData: internalFetchData
    }
  })

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
                  <Avatar src={avatar} >{username}</Avatar>
                }
                title={
                  // eslint-disable-next-line
                  <a href="javascript:;" className={styles["user-list-username"]} onClick={userAction?.bind(this, item)}>{username}</a>
                  // <Tooltip
                  //   title={
                  //     <UserDetail />
                  //   }
                  // >
                  //   <a className={styles["user-list-username"]} onClick={userAction?.bind(this, item)}>{username}</a>
                  // </Tooltip>
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