
export const mapStateToProps = (state: STORE_GLOBAL.IState) => {
  return {
    socket: state.Socket.value.socket,
    userInfo: state.getUserInfo.value,
  }
}

export const mapDispatchToProps = () =>  ({})