import { forgot } from '@/services'
import { generateAction } from '../utils'
import { history } from '@/utils'

export const { success, fail, begin, SUCCESS, FAIL, BEGIN } = generateAction<any>('FORGET')

export function fetchForget(params: API_USER.IForgetParams) {
  return (dispatch: any) => {
    dispatch(begin());
    return forgot(params)
    .then(json => {
      dispatch(success(json))
      history.replace('/login')
      return json
    })
    .catch(error => dispatch(fail(error)))
  }
}