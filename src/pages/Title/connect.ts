import { fetchLogout } from '@/store'

export const mapStateToProps = (state: STORE_GLOBAL.IState) => {
  return {
    userInfo: state.getUserInfo.value,
    value: state.Message.value?.messageList || [],
    inviteList: state.InviteFriend.value?.inviteFriendList || [],
  }
}

export const mapDispatchToProps = (dispatch: any) => {
  return {
    logout: () => dispatch(fetchLogout()),

  }
}