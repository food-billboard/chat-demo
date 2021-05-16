import { request } from '@/utils'

export const login = (data: API_USER.ILoginParams) => {
  return request('/api/user/logon/account', {
    method: 'POST',
    data
  })
}

export const logout = () => {
  return request('/api/user/logon/signout', {
    method: 'POST'
  })
}

export const register = (data: API_USER.IRegisterParams) => {
  return request<API_USER.IRegisterResData>('/api/user/logon/register', {
    data,
    method: 'POST'
  })
}

export const sendEmail = (data: API_USER.ISendEmailParams) => {
  return request('/api/user/logon/email', {
    data,
    method: 'POST'
  })
}

export const getUserInfo = () => {
  return request<API_USER.IGetUserInfoResData>('/api/customer/manage', {
    method: 'GET'
  })
}