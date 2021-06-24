export const mapStateToProps = (state: STORE_GLOBAL.IState) => {
  return {
    value: state.Message.value?.messageList || []
  }
}

export const mapDispatchToProps = (dispatch: any) => {
  return {  
    
  }
}