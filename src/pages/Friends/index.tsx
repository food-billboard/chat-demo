import React, { memo, useCallback, useRef } from 'react'
import { Row, Col, Button, message, Popconfirm } from 'antd'
import { IUserListRef } from '@/components/UserList'
import UserList from './components/UserList'
import { deleteRelation, black2User } from '@/services'
import styles from './index.less'

export default memo(() => {

  const listRef = useRef<IUserListRef>(null)

  const cancelBlack = useCallback(async (item: API_USER.IGetUserListData) => {
    await black2User({
      _id: item.friend_id
    })
    .then(_ => {
      return listRef.current?.fetchData()
    })
    .catch(err => {
      message.info('操作失败，请重试')
    })
  }, [listRef])

  const deleteUser = useCallback(async (item: API_USER.IGetUserListData) => {
    await deleteRelation({
      _id: item.friend_id
    })
    .then(_ => {
      return listRef.current?.fetchData()
    })
    .catch(err => {
      message.info('操作失败，请重试')
    })
  }, [listRef])

  const actions = useCallback((item) => {
    return [
      <Button onClick={cancelBlack.bind(this, item)} type="link" key="list-edit">拉黑</Button>, 
      <Popconfirm
        title="是否删除该好友?"
        onConfirm={deleteUser.bind(this, item)}
        okText="确定"
        cancelText="取消"
      >
        <Button danger type="link" key="list-delete">删除</Button>
      </Popconfirm>
    ]
  }, [cancelBlack, deleteUser])

  return (
    <Row 
      gutter={24}
      style={{width: '100%', position: 'relative', margin: 0}}
    >
      <UserList 
        actions={actions}
        wrapperRef={listRef}
      />
      <Col span={24}
        className={styles["friends-chat-list"]}
        style={{padding: 0}}
      >
        <div
          style={{height: '100%'}}
        >

        </div>
      </Col>
    </Row>
  )

})