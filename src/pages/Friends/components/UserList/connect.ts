import { roomList, exchangeRoom } from '@/store'

export const mapStateToProps = (state: STORE_GLOBAL.IState) => {
  return {
    socket: state.Socket.value.socket,
    userInfo: state.getUserInfo.value,
    currRoom: state.Socket.value?.room,
    fetchRoomLoading: state.Room.loading,
    roomList: state.Room.value?.roomList
  }
}

export const mapDispatchToProps = (dispatch: any) =>  ({
  getRoomList: (socket: any, params: API_CHAT.IGetRoomListParams) => dispatch(roomList(socket, params)),
  exchangeRoom: (socket: any, room: API_CHAT.IGetRoomListData, isJoin: boolean) => dispatch(exchangeRoom(socket, room, isJoin)),
})