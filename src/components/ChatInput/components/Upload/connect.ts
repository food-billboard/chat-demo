import { messageListDetailSave } from '@/store'

export const mapStateToProps = (state: STORE_GLOBAL.IState) => {
  return {
    currRoom: state.Socket.value?.room,
    userInfo: state.getUserInfo.value,
  }
}

export const mapDispatchToProps = (dispatch: any) =>  ({
  messageListDetailSave: (value: any, insert: { insertBefore?: boolean, insertAfter?: boolean }={}) => dispatch(messageListDetailSave(value, insert))
})