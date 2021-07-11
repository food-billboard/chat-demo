import { messageListDetail } from '@/store'

export const mapStateToProps = (state: STORE_GLOBAL.IState) => {
  return {
    userInfo: state.getUserInfo.value,
  }
}

export const mapDispatchToProps = (dispatch: any) => {
  return {
    messageListDetail: (socket: any, params: API_CHAT.IGetMessageDetailParams) => dispatch(messageListDetail(socket, params))
  }
}