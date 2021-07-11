import { generateAction } from '../utils'
import { getMessageDetail } from '@/utils/socket'

export const { success, fail, begin, SUCCESS, FAIL, BEGIN } = generateAction<any>('MESSAGE_DETAIL')

export function messageListDetail(socket: any, params: API_CHAT.IGetMessageDetailParams) {
  return async (dispatch: any) => {
    dispatch(begin())
    return getMessageDetail(socket, params)
    .catch(error => dispatch(fail(error)))
  }
}

export function messageListDetailSave(value: any, insert: { insertBefore?: boolean, insertAfter?: boolean }={}) {
  return async (dispatch: any) => {
    return dispatch(success({ messageDetailList: value, insert }))
  }
}