import { merge, omit } from 'lodash-es'
import {
  SUCCESS,
  BEGIN,
  FAIL
} from './action'
import { generateReducer } from '../utils'

const DEFAULT_VALUE = {
  messageDetailList: {
    message: [],
    insert: {
      insertBefore: false,
      insertAfter: false 
    }
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
      const { insert: { insertBefore, insertAfter }, messageDetailList } = value
      let messageList: any = {}
      const { messageDetailList: originMessageDetailList } = state.value
      if(insertBefore) {
        messageList = {
          room: originMessageDetailList.room,
          message: [...messageDetailList?.message || [], ...originMessageDetailList?.message || []]
        }
      }else if(insertAfter) {
        messageList = {
          room: originMessageDetailList.room,
          message: [...originMessageDetailList?.message || [], ...messageDetailList?.message || []]
        }
      }else {
        messageList = {
          ...messageDetailList
        }
      }
      return {
        ...(omit(state, ["value"])),
        loading: false,
        value: {
          ...state.value,
          messageDetailList: messageList 
        }
      }
    }
  }
})