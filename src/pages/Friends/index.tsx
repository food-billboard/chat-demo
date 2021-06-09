import { memo, useCallback, useMemo } from 'react'
import { Row, Col, Button, Modal, message } from 'antd'
import UserList from '@/components/UserList'
import { GroupChat } from '@/components/ChatList'
import { getBlackUser, unBlack2User, deleteRelation } from '@/services'
import styles from './index.less'

export default memo(() => {

  const fetchData = useCallback(async () => {
    return new Array(10).fill({
      username: "伙食棒棒", 
      avatar: "https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2035980560,2598993403&fm=58", 
      _id: '1',
      description: "我是天天才才hhhhhh" 
    })
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
      <Button onClick={cancelBlack.bind(this, item)} type="link" key="list-edit">取消</Button>, 
      <Button onClick={deleteUser.bind(this, item)} danger type="link" key="list-delete">删除</Button>
    ]
  }, [])

  return (
    <Row 
      gutter={24}
      style={{width: '100%', position: 'relative', margin: 0}}
    >
      <UserList 
        fetchData={fetchData} 
        actions={actions}
      />
      <Col span={24}
        className={styles["friends-chat-list"]}
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