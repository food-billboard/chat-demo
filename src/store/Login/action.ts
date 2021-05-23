import { login } from '@/services'
import { generateAction } from '../utils'
import { history, getPageQuery } from '@/utils'

export const redirectPage = () => {
  const urlParams = new URL(window.location.href);
  const params = getPageQuery();
  let { redirect } = params as { redirect: string };
  if (redirect) {
    const redirectUrlParams = new URL(redirect);
    if (redirectUrlParams.origin === urlParams.origin) {
      redirect = redirect.substr(urlParams.origin.length);
      if (redirect.match(/^\/.*#/)) {
        redirect = redirect.substr(redirect.indexOf('#') + 1);
      }
    } else {
      // window.location.href = '/home';
      redirect = '/home'
      // return;
    }
  }
  history.replace(redirect || '/home')
}

export const { success, fail, begin, SUCCESS, FAIL, BEGIN } = generateAction<any>('LOGIN')

export function fetchLogin(params: API_USER.ILoginParams) {
  return (dispatch: any) => {
    dispatch(begin());
    return login(params)
    .then(json => {
      dispatch(success(json))
      redirectPage()
      return json
    })
    .catch(error => dispatch(fail(error)))
  }
}