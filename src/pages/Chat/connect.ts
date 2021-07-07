import { connect, exchangeRoom } from '../../store'

export const mapStateToProps = (state: STORE_GLOBAL.IState) => {
  return {
    currRoom: state.Socket.value?.room,
    socket: state.Socket.value.socket,
  }
}

export const mapDispatchToProps = (dispatch: any) =>  ({
  connect: () => dispatch(connect()),
  exchangeRoom: (socket: any, room: API_CHAT.IGetRoomListData, isJoin: boolean) => dispatch(exchangeRoom(socket, room, isJoin)),
})