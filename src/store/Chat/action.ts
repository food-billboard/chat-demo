import { generateAction } from '../utils'
import { getMessageDetail } from '@/services'
import { connect as internalConnect, parseValue, connectStoreUserData, putRoom, joinRoom, readMessage } from '@/utils/socket'
import { setStorage, actionGet } from '@/utils/socket/utils'
import { messageListSave, messageList } from '../Message/action'
import { messageListDetailSave } from '../MessageDetail/action'
import { roomList, roomListSave } from '../Room/action'
import { inviteFriendList, inviteFriendListSave } from '../InviteList/action'

export const { success, fail, begin, SUCCESS, FAIL, BEGIN } = generateAction<any>('SOCKET')

const actionDeal = (key: string, value: any) => {
  const actions = actionGet(key)
  actions?.forEach((item: any) => {
    item?.(value)
  })
}

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

export function exchangeRoom(socket: any, room: API_CHAT.IGetRoomListData, isJoin: boolean) {
  return async (dispatch: any) => {  
    if(!room) return 
    dispatch(begin())
    const method = isJoin ? joinRoom : (socket: any, params: API_CHAT.IDeleteRoomParams) => {
      return messageListDetailSave({
        message: [],
        room: null
      })(dispatch)
      .then(_ => {
        return putRoom(socket, params)
      })
    }
    return method(socket, {
      _id: room._id
    })
    .then(_ => {
      const json = {
        room: isJoin ? room : null 
      }
      return (isJoin ? readMessage(socket, {
        type: 1,
        _id: room._id
      }) : Promise.resolve())
      .then(_ => {
        return dispatch(success(json))
      })
      .then(_ => json)
    })
    .catch(error => {
      return dispatch(fail(error))
    })
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
      Promise.all([
        dispatch(success({ socket })),
        dispatch(messageList(socket)),
        dispatch(roomList(socket)),
        dispatch(inviteFriendList(socket))
      ])
      .then(_ => {
        return actionDeal("connect_user", value)
      })
    }else {
      actionDeal("connect_user", value)
    }
  })

  // messagelist
  socket.on('get', (data: string) => {
    const value: any = parseValue(data)
    const { success, res: { data: resData } } = value 
    if(success) {
      dispatch(messageListSave(resData))
      .then(() => {
        return actionDeal("get", value)
      })
    }else {
      actionDeal("get", value)
    }
  })

  //message detail
  socket.on('message', (data: string) => {
    const value: any = parseValue(data)
    const { success, res: { data: resData } } = value 
    if(success) {
      dispatch(messageListDetailSave(resData))
      .then(() => {
        return actionDeal("message", value)
      })
    }else {
      actionDeal("message", value)
    }
  })

  //room list 
  socket.on('room', (data: string) => {
    const value: any = parseValue(data)
    const { success, res: { data: resData } } = value 
    if(success) {
      dispatch(roomListSave(resData))
      .then(() => {
        return actionDeal("room", value)
      })
    }else {
      actionDeal("room", value)
    }
  })

  //read message 
  socket.on('put', () => {
    dispatch(messageList(socket)).then(() => {
      return actionDeal("put", null)
    })
  })

  //delete message 
  socket.on('delete', () => {
    dispatch(messageList(socket))
    .then(() => {
      return actionDeal("delete", null)
    })
  })

  //room create 
  socket.on('create_room', () => {
    dispatch(roomList(socket))
    .then(() => {
      return actionDeal("create_room", null)
    })
  })

  //invite list 
  socket.on('invite_friend_list', (data: string) => {
    const value: any = parseValue(data)
    const { success, res: { data: resData } } = value 
    if(success) {
      dispatch(inviteFriendListSave(resData?.friends || []))
      .then(() => {
        return actionDeal("invite_friend_list", value)
      })
    }else {
      actionDeal("invite_friend_list", value)
    }
  })

  //invite 
  socket.on('invite_friend', (data: string) => {
    const value: any = parseValue(data)
    const { success } = value 
    if(success) {
      dispatch(inviteFriendList(socket))
      .then(() => {
        return actionDeal("invite_friend", value)
      })
    }else {
      actionDeal("invite_friend", value)
    }
  })

  socket.on('post', (data: string) => {
    const value: any = parseValue(data) 
    const { success, res: { data: id } } = value 
    if(success) {
      Promise.all([
        //消息列表
        dispatch(messageList(socket)),
        //消息详情
        getMessageDetail({
          messageId: id 
        })
        .then(data => {
          return dispatch(messageListDetailSave?.(data, {
            insertAfter: true 
          }))
        })
      ])
      .then(() => {
        return actionDeal("post", value)
      })
    }else {
      actionDeal("post", value)
    }
  })

}