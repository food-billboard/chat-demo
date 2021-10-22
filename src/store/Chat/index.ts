import { merge, pick, omit } from 'lodash-es'
import {
  SUCCESS,
  BEGIN,
  FAIL
} from './action'
import { generateReducer } from '../utils'

const DEFAULT_VALUE = {
  socket: null,
  room: null
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
        loading: false,
        value: {
          ...state.value,
          ...value 
        }
      }
    }
  }
})