import { generateAction } from '../utils'
import { inviteList } from '@/utils/socket'

export const { success, fail, begin, SUCCESS, FAIL, BEGIN } = generateAction<any>('INVITE_LIST')

export function inviteFriendList(socket: any, params: API_CHAT.IGetInviteFriendListParams={}) {
  return async (dispatch: any) => {
    dispatch(begin())
    return inviteList(socket, params)
    .catch(error => dispatch(fail(error)))
  }
}

export function inviteFriendListSave(value: any) {
  return async (dispatch: any) => {

    return dispatch(success({ inviteFriendList: value }))
  }
}