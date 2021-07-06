import { inviteFriendList } from '@/store'

export const mapStateToProps = (state: STORE_GLOBAL.IState) => {
  return {
    value: state.Message.value?.messageList || [],
    inviteList: state.InviteFriend.value?.inviteFriendList || [],
    socket: state.Socket.value?.socket
  }
}

export const mapDispatchToProps = (dispatch: any) => {
  return {  
    inviteFriendList: (socket: any, params: API_CHAT.IGetInviteFriendListParams={}) => dispatch(inviteFriendList(socket, params)),
  }
}