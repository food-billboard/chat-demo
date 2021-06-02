import { memo, useCallback, useMemo } from 'react'
import { Row, Col, Button, Modal, message, Result } from 'antd'
import UserList from '@/components/UserList'
import { getBlackUser, unBlack2User, deleteRelation } from '@/services'

export default memo(() => {

  const fetchData = useCallback(async () => {
    return [
      {
        username: "伙食棒棒", 
        avatar: "https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2035980560,2598993403&fm=58", 
        _id: '1',
        description: "我是天天才才hhhhhh" 
      }
    ]
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
      <Button onClick={deleteUser.bind(this, item)} danger type="link" key="list-delete">删除</Button>
    ]
  }, [])

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
      style={{width: '100%', padding: 10, boxSizing: 'border-box', margin: 0}}
    >
      <Col span={6}>
        <UserList 
          fetchData={fetchData} 
          actions={actions}
        />
      </Col>
      <Col span={18} style={{padding: 0}}>
        {ResultPage}
      </Col>
    </Row>
  )

})