import { merge } from 'lodash'
import { withTry } from '@/utils'
import { getRoomMembers } from '@/services'

export const formatRoomInfo: (room: API_CHAT.IGetRoomListData, userInfo: API_USER.IGetUserInfoResData) => Promise<API_CHAT.IGetRoomListData> = async (room, userInfo) => {
  const { info, type, _id } = room 
  if(type !== 'CHAT' || (!!info.name && !!info.avatar)) return room
  const [err, value] = await withTry(getRoomMembers)({ _id })
  const friend_id = userInfo?.friend_id
  const target = value?.find((item: any) => item.user?.friend_id !== friend_id) || {}
  if(err) console.warn('房间信息获取失败', err)
  return merge({}, room, { info: { avatar: target.user?.avatar, name: target.user?.username } })
}