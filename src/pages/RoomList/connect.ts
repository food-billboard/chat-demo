import { messageListDetail, exchangeRoom } from '../../store'

export const mapStateToProps = (state: STORE_GLOBAL.IState) => {
  return {
    socket: state.Socket.value.socket,
    value: state.MessageDetail.value.messageDetailList?.message || [],
    currRoom: state.Socket.value.room,
    userInfo: state.getUserInfo.value,
    room: state.Socket.value?.room
  }
}

export const mapDispatchToProps = (dispatch: any) =>  ({
  messageListDetail: (socket: any, params: API_CHAT.IGetMessageDetailParams) => dispatch(messageListDetail(socket, params)),
  exchangeRoom: (socket: any, room: API_CHAT.IGetRoomListData, isJoin: boolean) => dispatch(exchangeRoom(socket, room, isJoin)),
})