export const mapStateToProps = (state: STORE_GLOBAL.IState) => {
  return {
    value: state.Message.value?.messageList || [],
    socket: state.Socket.value?.socket
  }
}

export const mapDispatchToProps = (dispatch: any) => {
  return {  
    
  }
}