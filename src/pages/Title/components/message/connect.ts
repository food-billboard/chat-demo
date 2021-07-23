import { inviteFriendList, messageList } from '@/store'

export const mapStateToProps = (state: STORE_GLOBAL.IState) => {
  return {
    value: state.Message.value?.messageList || [],
    inviteList: state.InviteFriend.value?.inviteFriendList || [],
    socket: state.Socket.value?.socket,
    userInfo: state.getUserInfo.value,
    room: state.Socket.value?.room || [],
    currRoom: state.MessageDetail.value.messageDetailList?.room || {},
  }
}

export const mapDispatchToProps = (dispatch: any) => {
  return {  
    inviteFriendList: (socket: any, params: API_CHAT.IGetInviteFriendListParams={}) => dispatch(inviteFriendList(socket, params)),
    messageList: (socket: any) => dispatch(messageList(socket))
  }
}