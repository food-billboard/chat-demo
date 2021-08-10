import { fetchUserInfoData } from '../../store'

export const mapStateToProps = (state: STORE_GLOBAL.IState) => {
  return {
    userInfo: state.getUserInfo.value,
    loading: !!state.getUserInfo.loading
  }
}

export const mapDispatchToProps = (dispatch: any) =>  ({
  getUserInfo: () => dispatch(fetchUserInfoData())
})