import { generateAction } from '../utils'
import { connect as internalConnect, parseValue, connectStoreUserData } from '@/utils/socket'
import { setStorage } from '@/utils/socket/utils'
import { messageListSave, messageList } from '../Message/action'
import { messageListDetailSave } from '../MessageDetail/action'
import { roomList, roomListSave } from '../Room/action'
import { inviteFriendList, inviteFriendListSave } from '../InviteList/action'

export const { success, fail, begin, SUCCESS, FAIL, BEGIN } = generateAction<any>('SOCKET')

export function connect() {
  return (dispatch: any) => {
    dispatch(begin());
    return internalConnect()
    .then(json => {
      connect2User(json)
      eventBinding(dispatch, json)
      return json
    })
    .catch(error => dispatch(fail(error)))
  }
}

async function connect2User(socket: any) {
  return connectStoreUserData(socket)
}

function eventBinding(dispatch: any, socket: any) {

  //connect2user
  socket.on('connect_user', (data: string) => {
    const value: any = parseValue(data)
    const { success: isSuccess, res: { data: resData } } = value 
    if(isSuccess) {
      setStorage({
        temp_user_id: resData.temp_user_id
      })
      dispatch(success({ socket }))
      dispatch(messageList(socket))
      dispatch(roomList(socket))
      dispatch(inviteFriendList(socket))
    }
  })

  //messagelist
  socket.on('get', (data: string) => {
    const value: any = parseValue(data)
    const { success, res: { data: resData } } = value 
    if(success) {
      dispatch(messageListSave(resData))
    }
  })

  //message detail
  socket.on('message', (data: string) => {
    const value: any = parseValue(data)
    const { success, res: { data: resData } } = value 
    if(success) {
      dispatch(messageListDetailSave(resData))
    }
  })

  //room list 
  socket.on('room', (data: string) => {
    const value: any = parseValue(data)
    const { success, res: { data: resData } } = value 
    if(success) {
      dispatch(roomListSave(resData))
    }
  })

  //read message 
  socket.on('put', () => {
    console.log('读取消息完成')
    dispatch(messageList(socket))
  })

  //delete message 
  socket.on('delete', () => {
    console.log('删除消息完成')
    dispatch(messageList(socket))
  })

  //room create 
  socket.on('create_room', () => {
    console.log('创建房间完成')
    dispatch(roomList(socket))
  })

  //invite list 
  socket.on('invite_friend_list', (data: string) => {
    console.log('好友申请列表')
    const value: any = parseValue(data)
    const { success, res: { data: resData } } = value 
    if(success) {
      dispatch(inviteFriendListSave(resData?.friends || []))
    }
  })

}