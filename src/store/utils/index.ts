import { merge } from 'lodash-es'

export type DEFINE_CALLBACK_TYPE = {
  success?: any,
  error?: any,
  begin?: any
}

export function generateActionType(prefix?: string): {
  SUCCESS: string 
  BEGIN: string 
  FAIL: string 
} {
  const _prefix = prefix || Math.random().toString().slice(0, 5)
  const SUCCESS = `FETCH_${_prefix}_SUCCESS`
  const BEGIN = `FETCH_${_prefix}BEGIN`
  const FAIL = `FETCH_${_prefix}FAIL`
  return {
    SUCCESS,
    BEGIN,
    FAIL
  } 
}

export function generateAction<S=any, E=any, B=any>(prefix?: string, callback?: DEFINE_CALLBACK_TYPE) {
  const { BEGIN, SUCCESS, FAIL } = generateActionType(prefix)
  const beginFn = (init?: B) => {
    const returnData = {
      type: BEGIN,
      payload: { value: init }
    }
    if(callback?.begin) return callback?.begin(returnData)
    return returnData
  }
  const successFn = (res: S) => {
    const returnData = {
      type: SUCCESS,
      payload: { value: res }
    }
    if(callback?.success) return callback.success(returnData)
    return returnData
  }
  const failFn = (error: E) => {
    const returnData = {
      type: FAIL,
      payload: { error }
    }
    if(callback?.error) return callback.error(returnData)
    return returnData
  }
  return {
    begin: beginFn,
    success: successFn,
    fail: failFn,
    SUCCESS,
    FAIL,
    BEGIN
  }
}

export function generateReducer<SuccessType=any, ErrorType=any>({
  initialState,
  actionType,
  callback
}: {
  initialState: STORE_USER.IBaseState<SuccessType>
  callback?: DEFINE_CALLBACK_TYPE
  actionType: {
    BEGIN: string 
    SUCCESS: string 
    FAIL: string 
  }
}) {

  return function reducer(state = initialState, action: {
    type: string  
    payload: {
      error?: ErrorType 
      value?: SuccessType
    }
  }): STORE_USER.IBaseState<SuccessType> {
    switch(action.type) {
      case actionType.BEGIN:
        // 把 state 标记为 "loading" 这样我们就可以显示 spinner 或者其他内容
        // 同样，重置所有错误信息。我们从新开始。
        let returnData = {
          ...state,
          loading: true,
          error: null
        }
        if(callback?.begin) return callback.begin(returnData, state)
        return returnData
  
      case actionType.SUCCESS:
        // 全部完成：设置 loading 为 "false"。
        // 同样，把从服务端获取的数据赋给 items。
        if(callback?.success) return callback.success(action.payload.value, state)
        return {
          ...state,
          loading: false,
          value: action.payload.value!
        };
  
      case actionType.FAIL:
        // 请求失败，设置 loading 为 "false".
        // 保存错误信息，这样我们就可以在其他地方展示。
        // 既然失败了，我们没有产品可以展示，因此要把 `items` 清空。
        //
        // 当然这取决于你和应用情况：
        // 或许你想保留 items 数据！
        // 无论如何适合你的场景就好。
        let returnErrData = {
          ...state,
          loading: false,
          error: action.payload.error,
          value: merge({}, initialState.value)
        }
        if(callback?.error) return callback?.error(returnErrData, state)
        return returnErrData
  
      default:
        // reducer 需要有 default case。
        return state
    }
  }

}