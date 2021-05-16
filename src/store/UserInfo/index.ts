import Day from 'dayjs'
import { merge } from 'lodash-es'
import {
  SUCCESS,
  BEGIN,
  FAIL
} from './action'
import { generateReducer } from '../utils'

const DEFAULT_VALUE: STORE_USER.IUserInfo = {
  _id: "", 
  attentions: 0, 
  avatar: "", 
  fans: 0, 
  username: "", 
  createdAt: Day().format('YYY-MM-DD'),
  updatedAt: Day().format('YYY-MM-DD'), 
}

const initialState: STORE_USER.IBaseState<STORE_USER.IUserInfo> = {
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
  }
})