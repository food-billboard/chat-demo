import { merge, omit } from 'lodash-es'
import {
  SUCCESS,
  BEGIN,
  FAIL
} from './action'
import { generateReducer } from '../utils'
import { insertMessage } from '@/utils'

const omitMessage = (list: API_CHAT.IGetMessageDetailData[]) => {
  // return list.map(item => omit(item, ["status"]))
  return list 
}

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
      const newMessage = omitMessage(messageDetailList.message || []) as API_CHAT.IGetMessageDetailData[]
      if((insertBefore || insertAfter) && messageDetailList.room?._id === originMessageDetailList.room?._id) {
        messageList = {
          room: originMessageDetailList.room,
          message: insertMessage(originMessageDetailList?.message || [], newMessage, !insertBefore)
        }
      }else {
        messageList = {
          room: messageDetailList.room,
          message: newMessage
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