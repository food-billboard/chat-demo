import React, { useCallback, useState } from 'react'
import { Input } from 'antd'

const { Search } = Input

const UserList = (props: {
  onSearch?: (params: Partial<API_CHAT.IGetMemberListParams>) => Promise<API_CHAT.IGetMemberListData[]>
}) => {

  const [ searchValue, setSearchValue ] = useState("")

  const { onSearch } = props 

  const onChange = useCallback((value) => {
    setSearchValue(value.target.value)
  }, [])

  const handleSearch = useCallback(() => {
    onSearch?.({ content: searchValue })
  }, [searchValue])

  return (
    <Search
      placeholder="请输入用户名"
      value={searchValue}
      onChange={onChange}
      onPressEnter={handleSearch}
      onSearch={handleSearch}
    />
  )

}

export default UserList