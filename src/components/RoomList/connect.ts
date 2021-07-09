import { connect } from '../../store'

export const mapStateToProps = (state: STORE_GLOBAL.IState) => {
  return {
    value: state.Room.value?.roomList || [],
    userInfo: state.getUserInfo.value || {}
  }
}

export const mapDispatchToProps = (dispatch: any) =>  ({
  connect: () => dispatch(connect())
})