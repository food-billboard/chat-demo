import { generateAction } from '../utils'
import { getRoomList } from '@/utils/socket'

export const { success, fail, begin, SUCCESS, FAIL, BEGIN } = generateAction<any>('ROOM')

export function roomList(socket: any, params: API_CHAT.IGetRoomListParams={}) {
  return async (dispatch: any) => {
    dispatch(begin())
    return getRoomList(socket, params)
    .catch(error => dispatch(fail(error)))
  }
}

export function roomListSave(value: any) {
  return async (dispatch: any) => {
    return dispatch(success({ roomList: value }))
  }
}