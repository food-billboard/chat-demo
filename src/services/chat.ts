import { request } from '@/utils'

//聊天室成员列表
export const getRoomMembers = (params: API_CHAT.IGetMemberListParams) => {
  return request<API_CHAT.IGetMemberListData[]>('/api/chat/member', {
    params,
    method: 'GET'
  })
}

//消息详情
export const getMessageDetail = (params: API_CHAT.IGetMessageDetailParams) => {
  return request<API_CHAT.IGetMessageDetailRes>('/api/chat/message/detail', {
    params,
    method: 'GET'
  })
}

//发送消息
export const postMessage = (data: API_CHAT.IPostMessageParams) => {
  return request('/api/chat/message', {
    method: "POST",
    data
  })
}

//好友列表
export const getFriendsList = (params: API_CHAT.IGetFriendsListParams) => {
  return request<API_CHAT.IGetFriendsListRes[]>('/api/customer/manage/friends', {
    params,
    method: 'GET'
  })
}
