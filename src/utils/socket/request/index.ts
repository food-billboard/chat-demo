import Client from 'socket.io-client'
import JSCookie from 'js-cookie'
import { getStorage } from '../utils'

export const getToken = () => {
  // return JSCookie.get()
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYzQ5NmI2MmUyMDZkMTgwMzg1ODA0NyIsIm1vYmlsZSI6MTM1MDE4MjM0NzksIm1pZGRlbCI6Ik1JRERFTCIsImlhdCI6MTYyNTM3NjEwNSwiZXhwIjoxNjI1NDYyNTA1fQ.Rr3l3CsvJMObZfnT0lbGFLvJzmPorMu8rCw0toXGYUQ'
  // return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwN2MxNzZmMGY4NzJjN2EzZDU5NWNjMiIsIm1vYmlsZSI6MTgzNjgwMDMxOTAsIm1pZGRlbCI6Ik1JRERFTCIsImlhdCI6MTYyNTM3NDIyNiwiZXhwIjoxNjI1NDYwNjI2fQ.NH-gRXODEijMpKY7pS82JD6sLamQI7Ht_pwyG38eOuI'
}

export const parseValue = (value: string) => {
  if(typeof value === 'object') return value 
  try {
    return JSON.parse(value)
  }catch(err) {
    return {
      success: false,
      res: {
        errMsg: 'parse value error'
      }
    }
  }
}

//连接
export const connect = async () => {
  const socket = Client('ws://localhost:3001')
  return new Promise((resolve) => {
    socket.once('connect', () => {
      resolve(socket)
    })
  })
}

//用户信息存储
export const connectStoreUserData = async (socket: any) => {
  const { temp_user_id } = getStorage('temp_user_id')
  return Promise.resolve(socket.emit('connect_user', {
    temp_user_id: temp_user_id || '',
    token: getToken()
  }))
}

//消息列表
export const getMessage = async (socket: any, params: API_CHAT.IGetMessageListParams={}) => {
  socket.emit('get', {
    token: getToken(),
    ...params
  })
}

//消息详情
export const getMessageDetail = async (socket: any, params: API_CHAT.IGetMessageDetailParams) => {
  socket.emit('message', {
    token: getToken(),
    ...params
  })
}

//房间列表
export const getRoomList = async (socket: any, params: API_CHAT.IGetRoomListParams={}) => {
  socket.emit('room', {
    token: getToken(),
    ...params
  })
}

//进入房间
export const joinRoom = (socket: any, params: API_CHAT.IPostJoinRoomParams) => {
  socket.emit('join', {
    token: getToken(),
    ...params
  })
}

//发送消息
export const postMessage = (socket: any, params: API_CHAT.IPostMessageParams) => {
  socket.emit('post', {
    token: getToken(),
    ...params
  })
}

//读消息
export const readMessage = (socket: any, params: API_CHAT.IPutMessageParams) => {
  socket.emit('put', {
    token: getToken(),
    ...params
  })
}

//删除消息
export const deleteMessage = (socket: any, params: API_CHAT.IDeleteMessageParams) => {
  socket.emit('delete', {
    token: getToken(),
    ...params
  })
}

//退出房间
export const quitRoom = (socket: any, params: API_CHAT.IDeleteJoinRoomParams) => {
  socket.emit('quit_room', {
    token: getToken(),
    ...params
  })
}

//删除房间
export const deleteRoom = (socket: any, params: API_CHAT.IDeleteRoomParams) => {
  socket.emit('remove_room', {
    token: getToken(),
    ...params
  })
}

//离开房间(下线)
export const putRoom = (socket: any, params: API_CHAT.IDeleteRoomParams) => {
  socket.emit('leave', {
    token: getToken(),
    ...params
  })
}

//创建房间
export const createRoom = (socket: any, params: API_CHAT.ICreateRoomParams) => {
  socket.emit('create_room', {
    token: getToken(),
    ...params
  })
}

//申请添加好友
export const inviteFriend = (socket: any, params: API_USER.IPostFriendsParams) => {
  socket.emit('invite_friend', {
    token: getToken(),
    ...params
  })
}

//拒绝添加好友
export const disagreeFriend = (socket: any, params: API_CHAT.IDisagreeFriendParams) => {
  socket.emit('disagree_friend', {
    token: getToken(),
    ...params
  })
}

//同意添加好友
export const agreeFriend = (socket: any, params: API_CHAT.IAgreeFriendParams) => {
  socket.emit('agree_friend', {
    token: getToken(),
    ...params
  })
}

//申请列表
export const inviteList = async (socket: any, params: API_CHAT.IGetInviteFriendListParams) => {
  socket.emit('invite_friend_list', {
    token: getToken(),
    ...params
  })
}