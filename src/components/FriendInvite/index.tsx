import { useCallback, useState, useMemo, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTry } from '@/utils'
import { inviteFriend } from '@/utils/socket' 
import { getFriendsList } from '@/services'
import { mapStateToProps, mapDispatchToProps } from './connect'

export interface IProps {
  children: (props: {
    loading: boolean 
    action: any 
    isFriends: boolean 
  }) => any 
  socket?: any 
  userInfo?: STORE_USER.IUserInfo
  value: {
    _id: string 
    [key: string]: any 
  }
  force?: boolean 
} 

let FRIEND_LIST: API_CHAT.IGetFriendsListData[] = []

const FriendInvite = (props: IProps) => {

  const { children, socket, userInfo, value, force=false } = props 

  const [ postUserLoading, setPostUserLoading ] = useState<boolean>(false)
  const [ friendList, setFriendList ] = useState<API_CHAT.IGetFriendsListData[]>([])

  const fetchFriendsList = async () => {
    if(FRIEND_LIST.length && !force) {
      setFriendList(FRIEND_LIST || [])
      return 
    }
    const [, value] = await withTry(getFriendsList)({ pageSize: 9999 })
    setFriendList(value?.friends || [])
    FRIEND_LIST = value?.friends || []
  }

  const addFriends = useCallback(async (item: IProps["value"]) => {
    setPostUserLoading(true)
    await withTry(inviteFriend)(socket, {
      _id: item._id
    })
    setPostUserLoading(false)
  }, [socket])

  const isFriends = useMemo(() => {
    const { _id } = value 
    const { friend_id } = userInfo || {}
    return friend_id === _id || friendList.some(item => item.friend_id === _id) || !_id
  }, [userInfo, friendList, value])

  useEffect(() => {
    fetchFriendsList()
  // eslint-disable-next-line 
  }, [])

  return children({ 
    loading: postUserLoading,
    action: addFriends.bind(null, value),
    isFriends
  }) 

}

export default connect(mapStateToProps, mapDispatchToProps)(FriendInvite)