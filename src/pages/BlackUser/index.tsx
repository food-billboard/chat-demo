import { memo, useCallback, useMemo } from 'react'
import { Row, Col, Button, Modal, message } from 'antd'
import UserList from '@/components/UserList'
import { getBlackUser, unBlack2User, deleteRelation } from '@/services'

export default memo(() => {

  const fetchData = useCallback(async () => {
    return await getBlackUser()
  }, [])

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
      <Button onClick={cancelBlack.bind(this, item)} type="link" ghost key="list-edit">取消</Button>, 
      <Button onClick={deleteUser.bind(this, item)} danger ghost type="link" key="list-delete">删除</Button>
    ]
  }, [])

  return (
    <Row gutter={24}>
      <Col span={6}>
        <UserList 
          fetchData={fetchData} 
          actions={actions}
        />
      </Col>
      <Col span={18}>
        聊天框
      </Col>
    </Row>
  )

})