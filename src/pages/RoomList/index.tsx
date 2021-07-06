import React, { memo, useCallback, useState, useMemo, useEffect } from 'react'
import { Row, Col, Tooltip, Button } from 'antd'
import { connect } from 'react-redux'
import { merge } from 'lodash'
import { GroupChat } from '@/components/ChatList'
import RoomList from '@/components/RoomList'
import { putRoom, joinRoom } from '@/utils/socket/request'
import AvatarList, { TAvatarData } from '@/components/AvatarList'
import { getRoomMembers, postRelation } from '@/services'
import { mapStateToProps, mapDispatchToProps } from './connect'
import { withTry } from '@/utils'
import styles from './index.less'

export default connect(mapStateToProps, mapDispatchToProps)(memo((props: any) => {

  const [ curRoom, setCurRoom ] = useState<API_CHAT.IGetRoomListData>()
  const [ postUserLoading, setPostUserLoading ] = useState<boolean>(false)

  const { socket, messageListDetail, value, loading } = useMemo(() => {
    return props 
  }, [props])

  const fetchRoomList = useCallback(async (params: Omit<API_CHAT.IGetMessageDetailParams, "_id">={ currPage: 0, pageSize: 10 }) => {
    await messageListDetail(socket, merge({}, params, { _id: curRoom?._id }))
  }, [messageListDetail, socket, curRoom])

  const quitRoom = useCallback(() => {
    console.log('我离开了房间', curRoom)
    if(curRoom) putRoom(socket, { _id: curRoom._id })
    setCurRoom(undefined)
  }, [curRoom, socket])

  const onSelectRoom = useCallback((item: API_CHAT.IGetRoomListData) => {
    if(!!curRoom) {
      quitRoom()
    }
    joinRoom(socket, { _id: item._id })

    setCurRoom(item)
  }, [curRoom, socket, quitRoom])

  const fetchRoomUserList = useCallback(async () => {
    if(!curRoom) return []
    const data = await getRoomMembers({
      _id: curRoom._id,
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
  }, [curRoom])

  const addFriends = useCallback(async (item: TAvatarData) => {
    setPostUserLoading(true)
    await withTry(postRelation)({
      _id: item._id
    })
    setPostUserLoading(false)
  }, [])

  const tooltip = useCallback((node: React.ReactNode, item: TAvatarData, props: any) => {
    return (
      <Tooltip 
        title={<Button loading={postUserLoading} type="link" onClick={addFriends.bind(this, item)}>添加好友</Button>}
      >
        {node}
      </Tooltip>
    )
  }, [addFriends, postUserLoading])

  useEffect(() => {
    if(curRoom) {
      fetchRoomList()
    }
  }, [curRoom])

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
            !!curRoom && (
              <GroupChat  
                loading={loading}
                fetchData={fetchRoomList}
                value={value}
                header={{
                  title: curRoom.info?.name || '某房间',
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