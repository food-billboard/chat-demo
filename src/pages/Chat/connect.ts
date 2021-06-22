import { connect } from '../../store'

export const mapStateToProps = (_: STORE_GLOBAL.IState) => {
  return {}
}

export const mapDispatchToProps = (dispatch: any) =>  ({
  connect: () => dispatch(connect())
})