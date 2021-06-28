import Client from 'socket.io-client'
import JSCookie from 'js-cookie'
import { getStorage } from '../utils'

export const getToken = () => {
  // return JSCookie.get()
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwOTM0ZGE1NjFjM2Q0MGJhNjhhNjZhOSIsIm1vYmlsZSI6MTM1MjcxMDY4NzksIm1pZGRlbCI6Ik1JRERFTCIsImlhdCI6MTYyNDg0Mjk5NSwiZXhwIjoxNjI0OTI5Mzk1fQ.BR-V8_Knu21PWEI6BwLLNFPsyfIV29bOQ2n5pVOL72k'
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

export const createRoom = (socket: any, params: API_CHAT.ICreateRoomParams) => {
  socket.emit('create_room', {
    token: getToken(),
    ...params
  })
}