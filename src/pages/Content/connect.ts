import { fetchUserInfoData } from '../../store'

export const mapStateToProps = (state: STORE_GLOBAL.IState) => {
  return {
    userInfo: state.getUserInfo.value
  }
}

export const mapDispatchToProps = (dispatch: any) => {
  return {  
    getUserInfo: () => dispatch(fetchUserInfoData())
  }
}