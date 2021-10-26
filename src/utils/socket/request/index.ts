import Client from 'socket.io-client'
import JSCookie from 'js-cookie'
import { getStorage } from '../utils'

const development = process.env.NODE_ENV === "development"

const SOCKET_IO_ADDRESS = development ? "ws://localhost:3001" : {}

const mock = () => {
  const { userAgent } = window.navigator
  if(userAgent.includes('Chrome')) {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNzc1OTdkNmZlYWE1MGI5NjFkMzVmNyIsIm1vYmlsZSI6MTgzNjgwMDMxOTAsIm1pZGRlbCI6Ik1JRERFTCIsImlhdCI6MTYzNTIxMTY0NSwiZXhwIjoxNjM1Mjk4MDQ1fQ.BiuiGcU9iFwN3a819-_gtkbHuc55seOPQuQ9H-N0KTE'
  }
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNzIwZmVhM2ZlOTI5MGFhNTc1NzUyZCIsIm1vYmlsZSI6MTgzNjgwMDMxOTEsIm1pZGRlbCI6Ik1JRERFTCIsImZyaWVuZF9pZCI6IjYxNzIwZmVhM2ZlOTI5MGFhNTc1NzUyZiIsImlhdCI6MTYzNDg2NTU4NSwiZXhwIjoxNjM0OTUxOTg1fQ.ZYrM2Y5En_XfUnLnptnGAgwlQod-DxRTtintsaCxGOc'
}

export const getToken = () => {
  return development ? mock() : JSCookie.get("a6a7420d799ace72fefb1de7ec0be12f0ae900b29dad50ea9ebf832d999fc7d4")
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
export const joinRoom = async (socket: any, params: API_CHAT.IPostJoinRoomParams) => {
  return promisify(socket.emit.bind(socket, 'join', {
    token: getToken(),
    ...params
  }), socket.on.bind(socket, 'join'))
}

//发送消息
export const postMessage = async (socket: any, params: API_CHAT.IPostMessageParams) => {
  return promisify(socket.emit.bind(socket, 'post', {
    token: getToken(),
    ...params
  }), socket.on.bind(socket, 'post'))
}

//读消息
export const readMessage = (socket: any, params: API_CHAT.IPutMessageParams) => {
  return promisify(socket.emit.bind(socket, 'put', {
    token: getToken(),
    ...params
  }), socket.on.bind(socket, 'put'))
}

//删除消息
export const deleteMessage = (socket: any, params: API_CHAT.IDeleteMessageParams) => {
  socket.emit('delete', {
    token: getToken(),
    ...params
  })
}

//退出房间
export const quitRoom = async (socket: any, params: API_CHAT.IDeleteJoinRoomParams) => {
  return promisify(socket.emit.bind(socket, 'quit_room', {
    token: getToken(),
    ...params
  }), socket.on.bind(socket, 'quit_room'))
}

//删除房间
export const deleteRoom = (socket: any, params: API_CHAT.IDeleteRoomParams) => {
  return promisify(socket.emit.bind(socket, 'remove_room', {
    token: getToken(),
    ...params
  }), socket.on.bind(socket, 'remove_room'))
}

//离开房间(下线)
export const putRoom = (socket: any, params: API_CHAT.IDeleteRoomParams) => {
  return promisify(socket.emit.bind(socket, 'leave', {
    token: getToken(),
    ...params
  }), socket.on.bind(socket, 'leave'))
}

//创建房间
export const createRoom = (socket: any, params: API_CHAT.ICreateRoomParams) => {
  return promisify(socket.emit.bind(socket, 'create_room', {
    token: getToken(),
    ...params
  }), socket.on.bind(socket, 'create_room'))
}

//申请添加好友
export const inviteFriend = (socket: any, params: API_USER.IPostFriendsParams) => {
  return promisify(socket.emit.bind(socket, 'invite_friend', {
    token: getToken(),
    ...params
  }), socket.on.bind(socket, 'invite_friend'))
}

//拒绝添加好友
export const disagreeFriend = async (socket: any, params: API_CHAT.IDisagreeFriendParams) => {
  return promisify(socket.emit.bind(socket, 'disagree_friend', {
    token: getToken(),
    ...params
  }), socket.on.bind(socket, 'disagree_friend'))
}

//同意添加好友
export const agreeFriend = async (socket: any, params: API_CHAT.IAgreeFriendParams) => {
  return promisify(socket.emit.bind(socket, 'agree_friend', {
    token: getToken(),
    ...params
  }), socket.on.bind(socket, 'agree_friend'))
}

//申请列表
export const inviteList = async (socket: any, params: API_CHAT.IGetInviteFriendListParams) => {
  socket.emit('invite_friend_list', {
    token: getToken(),
    ...params
  })
}