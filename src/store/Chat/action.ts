import { forgot } from '@/services'
import { generateAction } from '../utils'
import { history } from '@/utils'
import { connect as internalConnect,  } from '@/utils/socket'

export const { success, fail, begin, SUCCESS, FAIL, BEGIN } = generateAction<any>('SOCKET')

export function connect(params: API_USER.IForgetParams) {
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

function eventBinding(socket: any) {

}