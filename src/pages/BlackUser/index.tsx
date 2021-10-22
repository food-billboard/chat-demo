import React, { memo, useCallback, useMemo, useRef } from 'react'
import { Row, Col, Button, Modal, message, Result } from 'antd'
import { UserList, IUserListRef } from '@/components/UserList'
import { getBlackUser, unBlack2User, deleteRelation } from '@/services'

export default memo(() => {

  const listRef = useRef<IUserListRef>(null)

  const fetchData = useCallback(async () => {
    const data = await getBlackUser()
    return data.black as API_USER.IGetFriendsRes[]
  }, [])

  const cancelBlack = useCallback(async (item: API_USER.IGetUserListData) => {
    await unBlack2User({
      _id: item.friend_id
    })
    .then(res => {
      return listRef.current?.fetchData()
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
        okText: '确定',
        cancelText: "取消",
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
        _id: item.friend_id
      })
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
      <Button onClick={cancelBlack.bind(this, item)} type="link" ghost key="list-edit">取消拉黑</Button>, 
      <Button onClick={deleteUser.bind(this, item)} danger type="link" key="list-delete">删除好友</Button>
    ]
  }, [cancelBlack, deleteUser])

  const ResultPage = useMemo(() => {
    return (
      <Result
        style={{backgroundColor: 'white', height: '100%'}}
        status="404"
        title="提示"
        subTitle="黑名单用户无法聊天哦，可以将好友请出黑名单😊"
        // extra={<Button type="primary">Back Home</Button>}
      />
    )
  }, [])

  return (
    <Row 
      gutter={24}
      style={{width: '100%', padding: 10, boxSizing: 'border-box', margin: 0, height: '100%'}}
    >
      <Col span={16}
        style={{height: '100%', overflow: 'auto'}}
      >
        <UserList 
          fetchData={fetchData} 
          actions={actions}
          style={{height: '100%', maxHeight: 'unset'}}
          locale={{emptyText: '暂无黑名单用户'}}
          ref={listRef}
        />
      </Col>
      <Col span={8} style={{padding: 0}}>
        {ResultPage}
      </Col>
    </Row>
  )

})