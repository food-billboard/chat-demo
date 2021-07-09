import { memo, useCallback } from 'react'
import { Row, Col, Button, Modal, message } from 'antd'
import UserList from './components/UserList'
import { unBlack2User, deleteRelation } from '@/services'
import styles from './index.less'

export default memo(() => {

  const cancelBlack = useCallback(async (item: API_USER.IGetUserListData) => {
    await unBlack2User({
      _id: item._id
    })
    .catch(err => {
      message.info('操作失败，请重试')
    })
  }, [])

  const deleteUser = useCallback(async (item: API_USER.IGetUserListData) => {
    await new Promise((resolve, reject) => {
      Modal.confirm({
        title: '提示',
        content: '是否删除该黑名单好友',
        onOk: (close) => {
          close()
          resolve(true)
        },
        onCancel: (close) => {
          close()
          resolve(false)
        }
      })
    })
    .then(res => {
      if(res) return deleteRelation({
        _id: item._id
      })
    })
    .catch(err => {
      message.info('操作失败，请重试')
    })
  }, [])

  const actions = useCallback((item) => {
    return [
      <Button onClick={cancelBlack.bind(this, item)} type="link" key="list-edit">拉黑</Button>, 
      <Button onClick={deleteUser.bind(this, item)} danger type="link" key="list-delete">删除</Button>
    ]
  }, [cancelBlack, deleteUser])

  return (
    <Row 
      gutter={24}
      style={{width: '100%', position: 'relative', margin: 0}}
    >
      <UserList 
        actions={actions}
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