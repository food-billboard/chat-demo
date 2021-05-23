import { register } from '@/services'
import { generateAction } from '../utils'
import { history } from '@/utils'

export const { success, fail, begin, SUCCESS, FAIL, BEGIN } = generateAction<any>('REGISTER')

export function fetchRegister(params: API_USER.IRegisterParams) {
  return (dispatch: any) => {
    dispatch(begin());
    return register(params)
    .then(json => {
      dispatch(success(json))
      history.replace('/login')
      return json
    })
    .catch(error => dispatch(fail(error)))
  }
}