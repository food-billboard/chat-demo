import { fetchRegister } from '../../store'

export const mapStateToProps = (state: STORE_GLOBAL.IState) => {
  return {
    userInfo: state.getUserInfo.value
  }
}

export const mapDispatchToProps = (dispatch: any) => {
  return {
    fetchRegister: (params: API_USER.IRegisterParams) => dispatch(fetchRegister(params))
  }
}