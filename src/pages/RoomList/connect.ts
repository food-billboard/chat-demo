import { messageListDetail } from '../../store'

export const mapStateToProps = (state: STORE_GLOBAL.IState) => {
  return {
    socket: state.Socket.value.socket
  }
}

export const mapDispatchToProps = (dispatch: any) =>  ({
  messageListDetail: (socket: any) => dispatch(messageListDetail(socket))
})