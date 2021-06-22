import { generateAction } from '../utils'
import { getMessage } from '@/utils/socket'

export const { success, fail, begin, SUCCESS, FAIL, BEGIN } = generateAction<any>('MESSAGE')

export function messageList(socket: any) {
  return async (dispatch: any) => {
    dispatch(begin())
    return getMessage(socket)
    .catch(error => dispatch(fail(error)))
  }
}

export function messageListSave(value: any) {
  return async (dispatch: any) => {
    return dispatch(success({ messageList: value }))
  }
}