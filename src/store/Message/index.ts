import { merge } from 'lodash-es'
import {
  SUCCESS,
  BEGIN,
  FAIL
} from './action'
import { generateReducer } from '../utils'

const DEFAULT_VALUE = {
  messageList: [],
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
  
})