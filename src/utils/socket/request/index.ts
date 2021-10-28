import Client from 'socket.io-client'
import { getToken as getTokenMethod } from '@/services'
import { withTry } from '@/utils'
import { getStorage } from '../utils'

const development = process.env.NODE_ENV === "development"

const SOCKET_IO_ADDRESS = development ? "ws://localhost:3001" : {}

export const getToken = async () => {
  const [, value] = await withTry(getTokenMethod)()
  return value
}

const promisify = (emit: any, on: any) => {
  return new Promise((resolve, reject) => {
    on((data: string) => {
      const value: any = parseValue(data)
      const { success, res: { data: resData, errMsg } } = value 
      if(success) {
        resolve(resData)
      }else {
        reject(errMsg)
      }
    })
    emit()
  })
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
  const socket = Client(SOCKET_IO_ADDRESS)
  return new Promise((resolve) => {
    socket.once('connect', () => {
      resolve(socket)
    })
  })
}

//用户信息存储
export const connectStoreUserData = async (socket: any) => {
  const { temp_user_id } = getStorage('temp_user_id')
  const token = await getToken()
  return Promise.resolve(socket.emit('connect_user', {
    temp_user_id: temp_user_id || '',
    token
  }))
}

//消息列表
export const getMessage = async (socket: any, params: API_CHAT.IGetMessageListParams={}) => {
  const token = await getToken()
  socket.emit('get', {
    token,
    ...params
  })
}

//消息详情
export const getMessageDetail = async (socket: any, params: API_CHAT.IGetMessageDetailParams) => {
  const token = await getToken()
  socket.emit('message', {
    token,
    ...params
  })
}

//房间列表
export const getRoomList = async (socket: any, params: API_CHAT.IGetRoomListParams={}) => {
  const token = await getToken()
  socket.emit('room', {
    token,
    ...params
  })
}

//进入房间
export const joinRoom = async (socket: any, params: API_CHAT.IPostJoinRoomParams) => {
  const token = await getToken()
  return promisify(socket.emit.bind(socket, 'join', {
    token,
    ...params
  }), socket.on.bind(socket, 'join'))
}

//发送消息
export const postMessage = async (socket: any, params: API_CHAT.IPostMessageParams) => {
  const token = await getToken()
  return promisify(socket.emit.bind(socket, 'post', {
    token,
    ...params
  }), socket.on.bind(socket, 'post'))
}

//读消息
export const readMessage = async (socket: any, params: API_CHAT.IPutMessageParams) => {
  const token = await getToken()
  return promisify(socket.emit.bind(socket, 'put', {
    token,
    ...params
  }), socket.on.bind(socket, 'put'))
}

//删除消息
export const deleteMessage = async (socket: any, params: API_CHAT.IDeleteMessageParams) => {
  const token = await getToken()
  socket.emit('delete', {
    token,
    ...params
  })
}

//退出房间
export const quitRoom = async (socket: any, params: API_CHAT.IDeleteJoinRoomParams) => {
  const token = await getToken()
  return promisify(socket.emit.bind(socket, 'quit_room', {
    token,
    ...params
  }), socket.on.bind(socket, 'quit_room'))
}

//删除房间
export const deleteRoom = async (socket: any, params: API_CHAT.IDeleteRoomParams) => {
  const token = await getToken()
  return promisify(socket.emit.bind(socket, 'remove_room', {
    token,
    ...params
  }), socket.on.bind(socket, 'remove_room'))
}

//离开房间(下线)
export const putRoom = async (socket: any, params: API_CHAT.IDeleteRoomParams) => {
  const token = await getToken()
  return promisify(socket.emit.bind(socket, 'leave', {
    token,
    ...params
  }), socket.on.bind(socket, 'leave'))
}

//创建房间
export const createRoom = async (socket: any, params: API_CHAT.ICreateRoomParams) => {
  const token = await getToken()
  return promisify(socket.emit.bind(socket, 'create_room', {
    token,
    ...params
  }), socket.on.bind(socket, 'create_room'))
}

//申请添加好友
export const inviteFriend = async (socket: any, params: API_USER.IPostFriendsParams) => {
  const token = await getToken()
  return promisify(socket.emit.bind(socket, 'invite_friend', {
    token,
    ...params
  }), socket.on.bind(socket, 'invite_friend'))
}

//拒绝添加好友
export const disagreeFriend = async (socket: any, params: API_CHAT.IDisagreeFriendParams) => {
  const token = await getToken()
  return promisify(socket.emit.bind(socket, 'disagree_friend', {
    token,
    ...params
  }), socket.on.bind(socket, 'disagree_friend'))
}

//同意添加好友
export const agreeFriend = async (socket: any, params: API_CHAT.IAgreeFriendParams) => {
  const token = await getToken()
  return promisify(socket.emit.bind(socket, 'agree_friend', {
    token,
    ...params
  }), socket.on.bind(socket, 'agree_friend'))
}

//申请列表
export const inviteList = async (socket: any, params: API_CHAT.IGetInviteFriendListParams) => {
  const token = await getToken()
  socket.emit('invite_friend_list', {
    token,
    ...params
  })
}