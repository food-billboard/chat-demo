import React, { memo, useCallback, useState, useMemo, useEffect, useRef } from 'react'
import { Row, Col, Tooltip, Button } from 'antd'
import { connect } from 'react-redux'
import { merge } from 'lodash'
import GroupChat, { IGroupChatRef } from '@/components/ChatList'
import RoomList from '@/components/RoomList'
import AvatarList, { TAvatarData } from '@/components/AvatarList'
import { getRoomMembers } from '@/services'
import { inviteFriend } from '@/utils/socket' 
import { mapStateToProps, mapDispatchToProps } from './connect'
import { withTry, sleep } from '@/utils'
import styles from './index.less'

export default connect(mapStateToProps, mapDispatchToProps)(memo((props: any) => {

  const [ postUserLoading, setPostUserLoading ] = useState<boolean>(false)

  const chatRef = useRef<IGroupChatRef>(null)

  const { socket, messageListDetail, value, userInfo, exchangeRoom, currRoom } = useMemo(() => {
    return props 
  }, [props])

  const fetchRoomMessageList = useCallback(async (params: Omit<API_CHAT.IGetMessageDetailParams, "_id">={ currPage: 0, pageSize: 10 }) => {
    await messageListDetail(socket, merge({}, params, { _id: currRoom?._id }))
  }, [messageListDetail, socket, currRoom])

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
      fetchRoomMessageList()
      .then(_ => sleep(1000))
      .then(_ => {
        chatRef?.current?.scrollToBottom?.()
      })
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
                ref={chatRef}
                fetchData={fetchRoomMessageList}
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