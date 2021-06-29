import { request } from '@/utils'

//聊天室成员列表
export const getRoomMembers = (params: API_CHAT.IGetMemberListParams) => {
  return request<API_CHAT.IGetMemberListData[]>('/api/chat/member', {
    params,
    method: 'GET'
  })
}
