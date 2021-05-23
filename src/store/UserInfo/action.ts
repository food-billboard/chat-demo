import { getUserInfo, logout } from '@/services'
import { generateAction } from '../utils'

export const { success, fail, begin, SUCCESS, FAIL, BEGIN } = generateAction<API_USER.IGetUserInfoResData>('GET_USER_INFO')

export function fetchUserInfoData() {
  return (dispatch: any) => {
    dispatch(begin())
    return getUserInfo()
    .then(json => {
      dispatch(success(json))
      return json
    })
    .catch(error => dispatch(fail(error)))
  }
}

export function fetchLogout() {
  return (dispatch: any) => {
    dispatch(begin());
    return logout()
    .then(_ => {
      dispatch(success({} as any))
      return {} as any
    })
    .catch(error => dispatch(fail(error)))
  }
}