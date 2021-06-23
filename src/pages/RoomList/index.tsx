import React, { memo, useCallback, useState, useMemo, useEffect } from 'react'
import { Row, Col } from 'antd'
import { connect } from 'react-redux'
import { GroupChat } from '@/components/ChatList'
import RoomList from '@/components/RoomList'
import { mapStateToProps, mapDispatchToProps } from './connect'
import styles from './index.less'

export default connect(mapStateToProps, mapDispatchToProps)(memo((props: any) => {

  const [ curRoomId, setCurRoomId ] = useState<string>()

  const { socket, messageListDetail } = useMemo(() => {
    return props 
  }, [props])

  const onSelectRoom = useCallback((item: API_CHAT.IGetRoomListData) => {
    setCurRoomId(item._id)
  }, [])

  const fetchRoomList = useCallback(async () => {
    return [] 
  }, [curRoomId])

  useEffect(() => {
    if(curRoomId) {
      fetchRoomList()
    }
  }, [curRoomId])

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
      />
      <Col span={24}
        className={styles["room-chat-list"]}
        style={{padding: 0}}
      >
        <div
          style={{height: '100%'}}
        >
          {
            !!curRoomId && (
              <GroupChat  
                fetchData={fetchRoomList}
              />
            )
          }
        </div>
      </Col>
    </Row>
  )

}))