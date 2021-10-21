import { roomList, messageList } from '@/store'

export const mapStateToProps = (state: STORE_GLOBAL.IState) => {
  return {
    socket: state.Socket.value.socket,
  }
}

export const mapDispatchToProps = (dispatch: any) =>  ({
  roomList: (socket: any, params: API_CHAT.IGetRoomListParams={}) => dispatch(roomList(socket, params)),
  messageList: (socket: any) => dispatch(messageList(socket)),
})