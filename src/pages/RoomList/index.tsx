import React, { memo, useCallback } from 'react'
import {  } from 'antd'
import { GroupChat } from '@/components/ChatList'
import RoomList from '@/components/UserList'
import styles from './index.less'

export default memo(() => {

  const fetchData = useCallback(async () => {
    return []
  }, [])

  const fetchRoomList = useCallback(async () => {
    return []
  }, [])

  return (
    <div
      className={styles["room-list-wrapper"]}
    >
      <RoomList 
        style={{
          position: 'absolute'
        }}
        fetchData={fetchRoomList}
      />
      <GroupChat 
        fetchData={fetchData}
      />
    </div>
  )

})