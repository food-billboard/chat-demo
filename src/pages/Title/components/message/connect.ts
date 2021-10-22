import { inviteFriendList, messageList, exchangeRoom } from '@/store'

export const mapStateToProps = (state: STORE_GLOBAL.IState) => {
  return {
    value: state.Message.value?.messageList || [],
    inviteList: state.InviteFriend.value?.inviteFriendList || [],
    socket: state.Socket.value?.socket,
    userInfo: state.getUserInfo.value,
    room: state.Socket.value?.room || [],
    currRoom: state.Socket.value.room,
  }
}

export const mapDispatchToProps = (dispatch: any) => {
  return {  
    inviteFriendList: (socket: any, params: API_CHAT.IGetInviteFriendListParams={}) => dispatch(inviteFriendList(socket, params)),
    messageList: (socket: any) => dispatch(messageList(socket)),
    exchangeRoom: (socket: any, room: API_CHAT.IGetRoomListData, isJoin: boolean) => dispatch(exchangeRoom(socket, room, isJoin)),
  }
}