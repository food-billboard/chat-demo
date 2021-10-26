import { exchangeRoom } from '../../store'

export const mapStateToProps = (state: STORE_GLOBAL.IState) => {
  return {
    socket: state.Socket.value.socket,
    currRoom: state.Socket.value.room,
    room: state.Socket.value?.room
  }
}

export const mapDispatchToProps = (dispatch: any) =>  ({
  exchangeRoom: (socket: any, room: API_CHAT.IGetRoomListData, isJoin: boolean) => dispatch(exchangeRoom(socket, room, isJoin)),
})