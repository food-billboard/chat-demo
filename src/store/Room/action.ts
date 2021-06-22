import { generateAction } from '../utils'
import { getRoomList } from '@/utils/socket'

export const { success, fail, begin, SUCCESS, FAIL, BEGIN } = generateAction<any>('ROOM')

export function roomList(socket: any) {
  return async (dispatch: any) => {
    dispatch(begin())
    return getRoomList(socket)
    .catch(error => dispatch(fail(error)))
  }
}

export function roomListSave(value: any) {
  return async (dispatch: any) => {
    return dispatch(success({ roomList: value }))
  }
}