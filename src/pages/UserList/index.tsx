import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Pagination, Row, Col, Button } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import { nanoid } from 'nanoid'
import { merge } from 'lodash-es'
import FriendInvite from '@/components/FriendInvite'
import { CardData as UserDetail } from '@/components/UserDetail'
import AvatarList from '@/components/AvatarList'
import Search from './components/Search'
import { getRoomMembers } from '@/services'
import { IMAGE_FALLBACK } from '@/utils'
import styles from './index.less'

const COL_SPAN = {
  xs: 24,
  sm: 12,
  lg: 6,
}

const Empty = () => {
  return (
    <div 
      style={{
        color: "#888888"
      }}
    >暂无房间</div>
  )
}

const UserList = () => {

  const [ memberList, setMemberList ] = useState<API_CHAT.IGetMemberListData[]>([])
  const [ currentPage, setCurrentPage ] = useState<number>(1)
  const [ total, setTotal ] = useState<number>(0)

  const fetchData = async (params: Partial<API_CHAT.IGetMemberListParams>={}) => {
    const data = await getRoomMembers(merge({}, { pageSize: 8 }, params))
    const { total=0, list=[] } = data || {}
    setMemberList(list)
    setTotal(total)
    return list 
  }

  const onPageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const formatMemberList = useMemo(() => {
    return memberList.map(item => {
      const { user, sid } = item
      if(user) return item 
      return {
        ...item,
        user: {
          username: "游客",
          description: sid,
          _id: sid || nanoid(),
          avatar: "",
          friend_id: ""
        }
      } 
    })
  }, [memberList])

  const memberListDom = useMemo(() => {
    return formatMemberList.map((item, index) => {
      const { user, room } = item 
      return (
        <Col
          {...COL_SPAN}
          style={{marginBottom: 24}}
          key={user._id}
        >
          <UserDetail
            {...user}
            className={styles["member-list-content-card"]}
            cover={
              <img
                alt={user.username}
                src={user.avatar || IMAGE_FALLBACK}
                style={{height: 200}}
              />
            }
            actions={[
              <AvatarList
                empty={<Empty />}
                groupProps={{
                  maxCount: 3
                }}
                fetchData={async () => room.map(item => {
                  const { name, avatar, _id } = item 
                  return {
                    _id,
                    username: name || "-",
                    avatar: avatar
                  }
                })}
              />,
              <FriendInvite
                value={{
                  _id: user.friend_id
                }}
                force={index === 0}
              >
                {
                  ({
                    isFriends,
                    loading,
                    action
                  }) => {
                    return (
                      <Button loading={loading} onClick={action} icon={<UserAddOutlined />} disabled={isFriends} type="link"></Button>
                    )
                  }
                }
              </FriendInvite>,
            ]}
          />
        </Col>
      )
    })
  }, [formatMemberList])

  useEffect(() => {
    fetchData({ currPage: currentPage - 1 })
  }, [currentPage])  

  return (
    <div className={styles["member-list"]}>
      <Search  
        onSearch={fetchData}
      />
      <div className={styles["member-list-content"]}>
        <Row
          gutter={24}
        >
          {memberListDom}
        </Row>
      </div>
      <div className={styles["member-list-pagination"]}>
        <Pagination
          current={currentPage}
          total={total}
          onChange={onPageChange}
        />
      </div>
    </div>
  )

}

export default UserList