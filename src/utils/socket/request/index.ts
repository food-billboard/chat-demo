import Client from 'socket.io-client'
import JSCookie from 'js-cookie'
import { getStorage } from '../utils'

export const getToken = () => {
  // return JSCookie.get()
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNWYxZDIwYjhjMzY1MzI3NjI4M2RhMCIsIm1vYmlsZSI6MTgzNjgwMDMxOTAsIm1pZGRlbCI6Ik1JRERFTCIsImlhdCI6MTYyMzMxNjU5NSwiZXhwIjoxNjIzNDAyOTk1fQ.xuQ-J_3-WcWqV51R4LatAnDRJOJwcoF4FZXMIq1Kk7s'
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
export const getMessage = async (socket: any) => {
  socket.emit('get', {
    token: getToken()
  })
}

//消息详情
export const getMessageDetail = async (socket: any) => {
  socket.emit('message', {
    token: getToken()
  })
}

//房间列表
export const getRoomList = async (socket: any) => {
  socket.emit('room', {
    token: getToken()
  })
}

//进入房间
export const joinRoom = () => {

}

//发送消息
export const postMessage = () => {

}

//读消息
export const readMessage = () => {

}

//删除消息
export const deleteMessage = () => {

}

//退出房间
export const quitRoom = () => {

}

//删除房间
export const deleteRoom = () => {

}

//离开房间(下线)
export const putRoom = () => {
  
}