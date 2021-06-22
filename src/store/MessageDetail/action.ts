import { generateAction } from '../utils'
import { getMessageDetail } from '@/utils/socket'

export const { success, fail, begin, SUCCESS, FAIL, BEGIN } = generateAction<any>('MESSAGE_DETAIL')

export function messageListDetail(socket: any) {
  return async (dispatch: any) => {
    dispatch(begin())
    return getMessageDetail(socket)
    .catch(error => dispatch(fail(error)))
  }
}

export function messageListDetailSave(value: any) {
  return async (dispatch: any) => {
    return dispatch(success({ messageDetailList: value }))
  }
}