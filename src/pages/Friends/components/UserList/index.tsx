import React, { memo, useMemo, useCallback, useState } from 'react'
import { Button, Popover, PopoverProps, Tabs } from 'antd'
import { merge } from 'lodash-es'
import { UserOutlined } from '@ant-design/icons'
import { UserList, IProps } from '@/components/UserList'
import { getRelation } from '@/services'

const { TabPane } = Tabs

interface IWrapperProps extends Omit<IProps, 'fetchData'> {
  popover?: Partial<PopoverProps>
  style?: React.CSSProperties
}

export default memo((props: IWrapperProps) => {

  const [ activeKey, setActiveKey ] = useState<'friends' | 'recent'>('friends')

  const { popover, style={}, ...nextProps } = useMemo(() => {
    return props
  }, [props])

  const fetchFriends = useCallback(async () => {
    const data = await getRelation({
      currPage: 0,
      pageSize: 9999
    })
    return data.friends
  }, [])
  

  const fetchRecentList = useCallback(async () => {
    return []
  }, [])

  const UserListContent = useMemo(() => {
    if(activeKey === 'friends') {
      return <UserList {...nextProps} fetchData={fetchFriends} />
    }
    return (
      <UserList {...nextProps} fetchData={fetchRecentList} locale={{emptyText: '暂无最近联系人'}} />
    )
  }, [nextProps, fetchFriends, fetchRecentList, activeKey])

  const onTabChange = useCallback((activekey) => {
    setActiveKey(activekey)
  }, [])

  const PopOverTitle = useMemo(() => {
    return (
      <Tabs activeKey={activeKey} onChange={onTabChange}>
        <TabPane tab="好友列表" key="friends" />
        <TabPane tab="最近联系人" key="recent" />
      </Tabs>
    )
  }, [onTabChange, activeKey])

  return (
    <Popover
      placement="rightBottom"
      title={PopOverTitle}
      content={UserListContent}
      trigger="click"
      {...popover}
    >
      <Button shape="circle" style={merge({}, { position: 'absolute', zIndex: 2, right: 12, top: '20vh' }, style)} icon={<UserOutlined />}></Button>
    </Popover>
  )

})