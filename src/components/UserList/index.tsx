import React, { forwardRef, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { List, Avatar, Skeleton, Image } from 'antd'
import { unstable_batchedUpdates } from 'react-dom'
import { IMAGE_FALLBACK } from '@/utils'
import styles from './index.less'

interface IProps {
  fetchData:() => Promise<API_USER.IGetUserListData[]>
  actions?: React.ReactNode[]
  userAction?: (data: API_USER.IGetUserListData) => any
}

interface IUserListRef {

}

const UserList = forwardRef<IUserListRef, IProps>((props, ref) => {

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
  }, [])

  return (
    <List
      className={styles["demo-loadmore-list"]}
      loading={loading}
      itemLayout="horizontal"
      // loadMore={loadMore}
      dataSource={list}
      renderItem={item => {
        const { avatar, username, description, _id } = item 
        return (
          <List.Item
            key={_id}
            actions={actions || []}
          >
            <Skeleton avatar title={false} loading={false} active>
              <List.Item.Meta
                avatar={
                  <Avatar src={
                    <Image src={avatar} fallback={IMAGE_FALLBACK} />
                  } >{username}</Avatar>
                }
                title={<a onClick={userAction?.bind(this, item)}>{username}</a>}
                description={description}
              />
              {/* <div>content</div> */}
            </Skeleton>
          </List.Item>
        )
      }}
    />
  )

})

export default memo(UserList)