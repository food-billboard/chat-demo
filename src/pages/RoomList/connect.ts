import { messageListDetail } from '../../store'

export const mapStateToProps = (state: STORE_GLOBAL.IState) => {
  return {
    socket: state.Socket.value.socket,
    value: state.MessageDetail.value.messageDetailList?.message || [],
    room: state.MessageDetail.value.messageDetailList?.room || {},
    loading: state.MessageDetail.loading
  }
}

export const mapDispatchToProps = (dispatch: any) =>  ({
  messageListDetail: (socket: any, params: API_CHAT.IGetMessageDetailParams) => dispatch(messageListDetail(socket, params)),
  
})