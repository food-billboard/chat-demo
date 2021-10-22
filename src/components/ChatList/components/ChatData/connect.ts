import { messageListDetailSave } from '@/store'

export const mapStateToProps = (state: STORE_GLOBAL.IState) => {
  return {
    userInfo: state.getUserInfo.value,
    currentRoom: state.Socket.value?.room,
    socket: state.Socket.value?.socket,
    fetchLoading: state.MessageDetail.loading
  }
}

export const mapDispatchToProps = (dispatch: any) => {
  return {
    messageListDetailSave: (value: any, insert: { insertBefore?: boolean, insertAfter?: boolean }={}) => dispatch(messageListDetailSave(value, insert))
  }
}