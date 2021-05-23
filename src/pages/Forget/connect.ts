import { fetchForget } from '../../store'

export const mapStateToProps = () => {
  return {}
}

export const mapDispatchToProps = (dispatch: any) => {
  return {
    fetchForget: (params: API_USER.IForgetParams) => dispatch(fetchForget(params))
  }
}