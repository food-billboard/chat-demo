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

export const forgot = (data: API_USER.IForgetParams) => {
  return request('/api/user/logon/forget', {
    data,
    method: 'PUT'
  })
}

export const sendEmail = (data: API_USER.ISendEmailParams) => {
  return request('/api/user/logon/email', {
    data,
    method: 'POST'
  })
}

export const getToken = () => {
  return request<string>("/api/customer/manage/token", {
    method: "GET",
    authorization: true 
  })
}

export const getUserInfo = () => {
  return request<API_USER.IGetUserInfoResData>('/api/customer/manage', {
    method: 'GET',
    authorization: true 
  })
}

export const black2User = (data: API_USER.IBlackUserParams) => {
  return request('/api/customer/manage/black', {
    data,
    method: 'PUT'
  })
}

export const unBlack2User = (params: API_USER.IUnBlackUserParams) => {
  return request('/api/customer/manage/black', {
    params,
    method: 'DELETE'
  })
}

export const getBlackUser = (params: API_USER.IGetBlackUserParams={}) => {
  return request<{
    black: API_USER.IGetBlackUserRes[]
  }>('/api/customer/manage/black', {
    params,
    method: 'GET'
  })
}

export const getRelation = (params: API_USER.IGetFriendsParams={}) => {
  return request<{ friends: API_USER.IGetFriendsRes[] }>('/api/customer/manage/friends', {
    params,
    method: 'GET'
  })
}

export const postRelation = (data: API_USER.IPostFriendsParams) => {
  return request('/api/customer/manage/friends', {
    data,
    method: 'POST'
  })
}

export const deleteRelation = (params: API_USER.IDeleteFriendsParams) => {
  return request('/api/customer/manage/friends', {
    params,
    method: 'DELETE'
  })
}

//修改个人信息
export const PutUserInfo = (data: API_USER.IPutUserInfoParams) => {
  return request('/api/manage/admin', {
    method: 'PUT',
    data
  })
}