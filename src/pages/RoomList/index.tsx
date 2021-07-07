import React, { memo, useCallback, useState, useMemo, useEffect } from 'react'
import { Row, Col, Tooltip, Button } from 'antd'
import { connect } from 'react-redux'
import { merge } from 'lodash'
import { GroupChat } from '@/components/ChatList'
import RoomList from '@/components/RoomList'
import AvatarList, { TAvatarData } from '@/components/AvatarList'
import { getRoomMembers, postRelation } from '@/services'
import { mapStateToProps, mapDispatchToProps } from './connect'
import { withTry } from '@/utils'
import styles from './index.less'

export default connect(mapStateToProps, mapDispatchToProps)(memo((props: any) => {

  const [ postUserLoading, setPostUserLoading ] = useState<boolean>(false)

  const { socket, messageListDetail, value, loading, userInfo, exchangeRoom, currRoom } = useMemo(() => {
    return props 
  }, [props])

  const fetchRoomList = useCallback(async (params: Omit<API_CHAT.IGetMessageDetailParams, "_id">={ currPage: 0, pageSize: 10 }) => {
    await messageListDetail(socket, merge({}, params, { _id: currRoom?._id }))
  }, [messageListDetail, socket, currRoom])

  const quitRoom = useCallback(async () => {
    console.log('我离开了房间', currRoom)
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
      pageSize: 9999      
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
    await withTry(postRelation)({
      _id: item._id
    })
    setPostUserLoading(false)
  }, [])

  const tooltip = useCallback((node: React.ReactNode, item: TAvatarData, props: any) => {
    const { _id } = item 
    const { friend_id } = userInfo
    if(friend_id === _id) return node 
    return (
      <Tooltip 
        key={_id}
        title={<Button loading={postUserLoading} type="link" onClick={addFriends.bind(this, item)}>添加好友</Button>}
      >
        {node}
      </Tooltip>
    )
  }, [addFriends, postUserLoading, userInfo])

  useEffect(() => {
    if(currRoom) {
      fetchRoomList()
    }
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
                loading={loading}
                fetchData={fetchRoomList}
                value={value}
                header={{
                  title: currRoom.info?.name || '某房间',
                  onBack: quitRoom,
                  extra: <AvatarList fetchData={fetchRoomUserList} avatarProps={{
                    tooltip
                  }} />
                }}
              />
            )
          }
        </div>
      </Col>
    </Row>
  )

}))