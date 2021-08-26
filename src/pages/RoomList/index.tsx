import React, { memo, useCallback, useState, useMemo, useEffect } from 'react'
import { Row, Col, Tooltip, Button } from 'antd'
import { connect } from 'react-redux'
import GroupChat from '@/components/ChatList'
import RoomList from '@/components/RoomList'
import AvatarList, { TAvatarData } from '@/components/AvatarList'
import { getRoomMembers, getFriendsList } from '@/services'
import { inviteFriend } from '@/utils/socket' 
import { mapStateToProps, mapDispatchToProps } from './connect'
import { withTry } from '@/utils'
import styles from './index.less'

export default connect(mapStateToProps, mapDispatchToProps)(memo((props: any) => {

  const [ postUserLoading, setPostUserLoading ] = useState<boolean>(false)
  const [ friendList, setFriendList ] = useState<API_CHAT.IGetFriendsListData[]>([])

  const { socket, userInfo, exchangeRoom, currRoom } = useMemo(() => {
    return props 
  }, [props])

  const quitRoom = useCallback(async () => {
    await exchangeRoom(socket, currRoom, false)
  }, [currRoom, socket, exchangeRoom])

  const onSelectRoom = useCallback(async (item: API_CHAT.IGetRoomListData) => {
    await quitRoom()
    await exchangeRoom(socket, item, true)
  }, [socket, exchangeRoom, quitRoom])

  const fetchRoomUserList = useCallback(async () => {
    if(!currRoom) return []
    const data = await getRoomMembers({
      _id: currRoom?._id,
      currPage: 0,
      pageSize: 100      
    })
    return data?.map(item => {
      const { user } = item 
      return {
        _id: user.friend_id,
        username: user?.username,
        avatar: user?.avatar
      }
    }) || []
  }, [currRoom])

  const addFriends = useCallback(async (item: TAvatarData) => {
    setPostUserLoading(true)
    await withTry(inviteFriend)(socket, {
      _id: item._id
    })
    setPostUserLoading(false)
  }, [socket])

  const tooltip = useCallback((node: React.ReactNode, item: TAvatarData, props: any) => {
    const { _id } = item 
    const { friend_id } = userInfo
    if(friend_id === _id || friendList.some(item => item.friend_id === _id)) return node 
    return (
      <Tooltip 
        key={_id}
        title={<Button loading={postUserLoading} type="link" onClick={addFriends.bind(this, item)}>添加好友</Button>}
      >
        {node}
      </Tooltip>
    )
  }, [addFriends, postUserLoading, userInfo, friendList])

  const chatHeader = useMemo(() => {
    return {
      title: currRoom?.info?.name || '某房间',
      onBack: quitRoom,
      extra: <AvatarList fetchData={fetchRoomUserList} avatarProps={{
        tooltip
      }} />
    }
  }, [currRoom, quitRoom, fetchRoomUserList, tooltip])

  const fetchFriendsList = useCallback(async (roomInfo: API_CHAT.IGetRoomListData) => {
    const [, value] = await withTry(getFriendsList)({ pageSize: 9999 })
    setFriendList(value?.friends || [])
  }, [])

  useEffect(() => {
    fetchFriendsList(currRoom)
  }, [currRoom])

  return (
    <Row 
      gutter={24}
      style={{width: '100%', position: 'relative', margin: 0}}
    >
      <RoomList 
        style={{
          position: 'absolute'
        }}
        onClick={onSelectRoom}
        clickClose
      />
      <Col span={24}
        className={styles["room-chat-list"]}
        style={{padding: 0}}
      >
        <div
          style={{height: '100%'}}
        >
          {
            !!currRoom && (
              <GroupChat  
                header={chatHeader}
              />
            )
          }
        </div>
      </Col>
    </Row>
  )

}))