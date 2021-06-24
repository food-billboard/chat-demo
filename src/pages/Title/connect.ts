import { fetchLogout } from '@/store'

export const mapStateToProps = (state: STORE_GLOBAL.IState) => {
  return {
    userInfo: state.getUserInfo.value,
  }
}

export const mapDispatchToProps = (dispatch: any) => {
  return {
    logout: () => dispatch(fetchLogout()),

  }
}