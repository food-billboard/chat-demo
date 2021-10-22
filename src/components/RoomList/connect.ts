import { roomList } from '../../store'

export const mapStateToProps = (state: STORE_GLOBAL.IState) => {
  return {
    value: state.Room.value?.roomList || [],
    userInfo: state.getUserInfo.value || {},
    socket: state.Socket.value.socket,
  }
}

export const mapDispatchToProps = (dispatch: any) =>  ({
  roomList: (socket: any, params: API_CHAT.IGetRoomListParams={}) => dispatch(roomList(socket, params)),
})