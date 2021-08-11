
export const mapStateToProps = (state: STORE_GLOBAL.IState) => {
  return {
    userInfo: state.getUserInfo.value,
    currRoom: state.Socket.value?.room,
    socket: state.Socket.value.socket,
  }
}

export const mapDispatchToProps = (dispatch: any) => {
  return {
    
  }
}