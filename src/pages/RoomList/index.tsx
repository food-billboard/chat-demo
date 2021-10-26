import React, { memo, useCallback, useMemo } from 'react'
import { Row, Col, Tooltip, Button } from 'antd'
import { connect } from 'react-redux'
import GroupChat from '@/components/ChatList'
import RoomList from '@/components/RoomList'
import FriendInvite from '@/components/FriendInvite'
import AvatarList, { TAvatarData } from '@/components/AvatarList'
import { getRoomMembers } from '@/services'
import { mapStateToProps, mapDispatchToProps } from './connect'
import styles from './index.less'

export default connect(mapStateToProps, mapDispatchToProps)(memo((props: any) => {

  const { socket, exchangeRoom, currRoom } = props

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
    return data?.list.map(item => {
      const { user } = item 
      return {
        _id: user.friend_id,
        username: user?.username,
        avatar: user?.avatar
      }
    }) || []
  }, [currRoom])

  const tooltip = useCallback((node: React.ReactNode, item: TAvatarData, props: any) => {
    const { _id } = item 
    return (
      <FriendInvite
        value={item}
        force
      >
        {
          ({
            isFriends,
            action,
            loading
          }) => {

            if(isFriends) return node 
            return (
              <Tooltip 
                key={_id}
                title={<Button loading={loading} type="link" onClick={action}>添加好友</Button>}
              >
                {node}
              </Tooltip>
            )

          }
        }
      </FriendInvite>
    )
  }, [])

  const chatHeader = useMemo(() => {
    return {
      title: currRoom?.info?.name || '某房间',
      onBack: quitRoom,
      extra: <AvatarList fetchData={fetchRoomUserList} avatarProps={{
        tooltip
      }} />
    }
  }, [currRoom, quitRoom, fetchRoomUserList, tooltip])

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