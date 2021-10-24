import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Pagination } from 'antd'
import { merge } from 'lodash-es'
import Search from './components/Search'
import { getRoomMembers } from '@/services'
import styles from './index.less'

const UserList = () => {

  const [ memberList, setMemberList ] = useState<API_CHAT.IGetMemberListData[]>([])
  const [ currentPage, setCurrentPage ] = useState<number>(0)
  const [ total, setTotal ] = useState<number>(0)

  const fetchData = useCallback(async (params: Partial<API_CHAT.IGetMemberListParams>={}) => {
    const data = await getRoomMembers(merge({}, { currPage: currentPage }, params))
    console.log(data, 23333)
    return []
  }, [currentPage])

  const onPageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  useEffect(() => {
    fetchData()
  }, [currentPage])  

  return (
    <div className={styles["member-list"]}>
      <Search  
        onSearch={fetchData}
      />
      用户列表
      <Pagination
        current={currentPage}
        total={total}
        onChange={onPageChange}
      />
    </div>
  )

}

export default UserList