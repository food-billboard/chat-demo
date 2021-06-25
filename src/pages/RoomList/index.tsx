import React, { memo, useCallback, useState, useMemo, useEffect } from 'react'
import { Row, Col } from 'antd'
import { connect } from 'react-redux'
import { merge } from 'lodash'
import { GroupChat } from '@/components/ChatList'
import RoomList from '@/components/RoomList'
import { putRoom, joinRoom } from '@/utils/socket/request'
import { mapStateToProps, mapDispatchToProps } from './connect'
import styles from './index.less'

export default connect(mapStateToProps, mapDispatchToProps)(memo((props: any) => {

  const [ curRoom, setCurRoom ] = useState<API_CHAT.IGetRoomListData>()

  const { socket, messageListDetail, value, loading } = useMemo(() => {
    return props 
  }, [props])

  const onSelectRoom = useCallback((item: API_CHAT.IGetRoomListData) => {
    if(!!curRoom) {
      console.log('离开当前房间')
      quitRoom()
    }
    joinRoom(socket, { _id: item._id })
    console.log('进入指定房间')
    setCurRoom(item)
  }, [curRoom, socket])

  const fetchRoomList = useCallback(async (params: Omit<API_CHAT.IGetMessageDetailParams, "_id">={ currPage: 0, pageSize: 10 }) => {
    await messageListDetail(socket, merge({}, params, { _id: curRoom?._id }))
  }, [messageListDetail, socket, curRoom])

  const quitRoom = useCallback(() => {
    console.log('我离开了房间', curRoom)
    if(curRoom) putRoom(socket, { _id: curRoom._id })
    setCurRoom(undefined)
  }, [curRoom, socket])

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
                  onBack: quitRoom
                }}
              />
            )
          }
        </div>
      </Col>
    </Row>
  )

}))