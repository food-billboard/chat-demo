import React, { memo, useMemo, useCallback, useState, useEffect, Ref } from 'react'
import { Button, message, Popover, PopoverProps, Tabs } from 'antd'
import { merge } from 'lodash-es'
import { connect } from 'react-redux'
import { UserOutlined } from '@ant-design/icons'
import { UserList, IProps, IUserListRef } from '@/components/UserList'
import { getRelation } from '@/services'
import { createRoom } from '@/utils/socket'
import { history, withTry } from '@/utils'
import { formatRoomInfo } from '../../../RoomList/utils'
import { mapStateToProps, mapDispatchToProps } from './connect'

const { TabPane } = Tabs

interface IWrapperProps extends Omit<IProps, 'fetchData'> {
  popover?: Partial<PopoverProps>
  style?: React.CSSProperties
  wrapperRef?: Ref<IUserListRef>
  [key: string]: any 
}

const UserListWrapper = memo((props: IWrapperProps) => {

  const [ activeKey, setActiveKey ] = useState<'friends' | 'recent'>('friends')
  const [ loading, setLoading ] = useState<boolean | null>(null)
  const [ currRoomId, setCurrRoomId ] = useState<string>('')

  const { popover, style={}, userInfo, socket, currRoom, roomList, getRoomList, fetchRoomLoading, exchangeRoom, wrapperRef, ...nextProps } = useMemo(() => {
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

  const startChat = useCallback(async (data: API_USER.IGetFriendsRes) => {
    const { member } = data 
    console.log(userInfo.member, member, 666666666)
    const [err, value] = await withTry(createRoom)(socket, {
      type: "CHAT",
      members: member
    })
    if(err) {
      message.info('该用户还不是您好友')
    }else {
      setLoading(true)
      setCurrRoomId(value)
      await getRoomList(socket)
    }
  }, [socket, getRoomList, userInfo])

  const go2Room = useCallback(async () => {
    const roomData = roomList.find((item: any) => item._id === currRoomId)
    const data = await formatRoomInfo(roomData, userInfo!)
    if(data) await exchangeRoom(socket, data, true)
    history.push('/main/room')
    setLoading(null)
  }, [exchangeRoom, socket, roomList, currRoomId, userInfo])

  const UserListContent = useMemo(() => {
    if(activeKey === 'friends') {
      return <UserList {...nextProps} fetchData={fetchFriends} userAction={startChat} ref={wrapperRef} />
    }
    return (
      <UserList {...nextProps} fetchData={fetchRecentList} locale={{emptyText: '暂无最近联系人'}} userAction={startChat} ref={wrapperRef} />
    )
  }, [nextProps, fetchFriends, fetchRecentList, activeKey, startChat, wrapperRef])

  const onTabChange = useCallback((activeKey) => {
    setActiveKey(activeKey)
  }, [])

  const PopOverTitle = useMemo(() => {
    return (
      <Tabs activeKey={activeKey} onChange={onTabChange}>
        <TabPane tab="好友列表" key="friends" />
        <TabPane tab="最近联系人" key="recent" />
      </Tabs>
    )
  }, [onTabChange, activeKey])

  useEffect(() => {
    if(!fetchRoomLoading && loading) {
      go2Room()
    }
  }, [fetchRoomLoading, loading, go2Room])

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

export default connect(mapStateToProps, mapDispatchToProps)(UserListWrapper)