import React, { memo, useCallback } from 'react'
import { Row, Col } from 'antd'
import { GroupChat } from '@/components/ChatList'
import RoomList from '@/components/RoomList'
import {  } from '@/services'
import styles from './index.less'

export default memo(() => {

  const fetchData = useCallback(async () => {
    return []
  }, [])

  const fetchRoomList = useCallback(async () => {
    return []
  }, [])

  return (
    <Row 
      gutter={24}
      style={{width: '100%', position: 'relative', margin: 0}}
    >
      <RoomList 
        style={{
          position: 'absolute'
        }}
      />
      <Col span={24}
        className={styles["room-chat-list"]}
        style={{padding: 0}}
      >
        <div
          style={{height: '100%'}}
        >
          <GroupChat  
            fetchData={() => Promise.resolve([{
              user: {
                avatar: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fyouimg1.c-ctrip.com%2Ftarget%2Ftg%2F035%2F063%2F726%2F3ea4031f045945e1843ae5156749d64c.jpg&refer=http%3A%2F%2Fyouimg1.c-ctrip.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1624938513&t=c2c45e41131c582ab105bf2c6f581aed",
                _id: '1',
                username: "用户名",
                description: '描述', 
              },
              message: {
                value: "1111".repeat(50), 
                type: 'TEXT',
                poster: "", 
                createdAt: "2020-11-23", 
              },
              isMine: false 
            }, 
            {
              user: {
                avatar: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fyouimg1.c-ctrip.com%2Ftarget%2Ftg%2F035%2F063%2F726%2F3ea4031f045945e1843ae5156749d64c.jpg&refer=http%3A%2F%2Fyouimg1.c-ctrip.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1624938513&t=c2c45e41131c582ab105bf2c6f581aed",
                _id: '1',
                username: "用户名",
                description: '描述', 
              },
              message: {
                value: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fyouimg1.c-ctrip.com%2Ftarget%2Ftg%2F035%2F063%2F726%2F3ea4031f045945e1843ae5156749d64c.jpg&refer=http%3A%2F%2Fyouimg1.c-ctrip.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1624938513&t=c2c45e41131c582ab105bf2c6f581aed", 
                type: 'IMAGE',
                poster: "", 
                createdAt: "2020-11-22", 
              },
              isMine: true 
            }, 
          ])}
          />
        </div>
      </Col>
    </Row>
  )

})