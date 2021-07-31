import { merge, omit } from 'lodash-es'
import {
  SUCCESS,
  BEGIN,
  FAIL
} from './action'
import { generateReducer } from '../utils'
import { insertMessage } from '@/utils'

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
      if(insertBefore || insertAfter) {
        messageList = {
          room: originMessageDetailList.room,
          message: insertMessage(originMessageDetailList?.message || [], messageDetailList?.message || [], !insertBefore)
        }
      }else {
        messageList = {
          ...messageDetailList
        }
      }
      // try {
      //   console.log(messageList.message[messageList.message.length- 1], 666666)
      // }catch(err) {}
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