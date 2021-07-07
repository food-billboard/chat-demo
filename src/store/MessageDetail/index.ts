import { merge, pick, omit } from 'lodash-es'
import {
  SUCCESS,
  BEGIN,
  FAIL
} from './action'
import { generateReducer } from '../utils'

const DEFAULT_VALUE = {
  messageDetailList: {
    message: [],
    room: {}
  },
}

const initialState = {
  value: merge({}, DEFAULT_VALUE),
  loading: false,
  error: null
}

export default generateReducer({
  initialState,
  actionType: {
    SUCCESS,
    BEGIN,
    FAIL
  },
  callback: {
    success: (value: any, state: any) => {
      return {
        ...(omit(state, ["value"])),
        value: {
          ...state.value,
          ...value 
        }
      }
    }
  }
})