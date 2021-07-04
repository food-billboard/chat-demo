export const mapStateToProps = (state: STORE_GLOBAL.IState) => {
  console.log(state, 2222)
  return {
    value: state.Message.value?.messageList || [],
    inviteList: state.InviteFriend.value?.inviteFriendList || [],
    socket: state.Socket.value?.socket
  }
}

export const mapDispatchToProps = (dispatch: any) => {
  return {  
    
  }
}