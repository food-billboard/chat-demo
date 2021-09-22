import { TUploadFn, Upload } from 'chunk-file-upload'
import { message } from 'antd'
import Day from 'dayjs'
import { checkUploadFile, uploadFile, putVideoPoster, postMessage } from '@/services'
import { withTry } from '@/utils'
import PosterGetter from '@/utils/getVideoPoster'
import { merge } from 'lodash'

const MAX_UPLOAD_FILE_SIZE = 1024 * 1024 * 5 

const INSTANCE = new Upload()

const VALID_FILE_TYPE = [
  "IMAGE",
  "VIDEO"
]

const posterGetter = new PosterGetter()

const watch = (success: boolean, name: Symbol, error: boolean) => {
  if(!!success) {
    return {
      error: null,
      progress: 1,
      status: 4,
    }
  }
  const result = INSTANCE.watch(name)
  if(!result || !result.length || error) return false
  const [ target ] = result
  if(!target) return false 
  return {
    error: target?.error, 
    progress: target?.progress, 
    status: target?.status, 
  }
}

const exitDataFn = (getResult: (data: any) => void) => async (params: {
  filename: string
  md5: string
  suffix: string
  size: number
  chunkSize: number
  chunksLength: number
}) => {
  const { size, suffix, md5, chunkSize } = params
  const data = await checkUploadFile({
    auth: "PUBLIC",
    mime: suffix,
    chunk: chunkSize,
    md5,
    size,
    name: md5
  })
  getResult(data)
  return data 
}

const uploadFn: TUploadFn = async (data, name) => {
  const task = INSTANCE.getTask(name)
  const size = (task!.file.file as File).size 
  let response: any = {}
  const md5 = data.get('md5')
  const file = data.get('file')
  const index = data.get("index") as any 
  try {
    response = await uploadFile({
      md5: md5 as string,
      file: file as Blob,
      offset: (index as number) * MAX_UPLOAD_FILE_SIZE
    })
  }catch(err) {
    console.log(err)
  }
  const nextOffset = response["upload-offset"] ?? response["Upload-Offset"]
  if(nextOffset >= size) return {
    data: size
  }
  return {
    data: nextOffset >= size ? size : nextOffset
  }
}

export const uploadPoster = async (file: File): Promise<string> => {
  const data = await posterGetter.start(file)
  let posterId = ""
  return new Promise((resolve, reject) => {
    const [ name ] = INSTANCE.add({
      file: {
        file: data as File,
      },
      request: {
        exitDataFn: exitDataFn((value) => {
          posterId = value?._id
        }),
        uploadFn,
        callback: (err: any) => {
          resolve(posterId)
        }
      }
    })
  
    if(!name) {
      return reject("")
    }
  
    INSTANCE.deal(name)
  })
}

export const upload = async (file: File, room: API_CHAT.IGetRoomListData, defaultMessageData: Partial<API_CHAT.IGetMessageDetailData>, postCompleteMessage: any) => {
  let [ mimeType ] = file.type.toUpperCase().split('/')
  let success = false 
  let error = false 
  let isExists = false 
  let contentId = ""
  let posterId = ""
  const TOTAL_SIZE = file.size 

  if(!VALID_FILE_TYPE.includes(mimeType)) {
    message.info("文件格式不正确~")
    return 
  }
  let content: any  = {
    [mimeType!.toLowerCase()]: file,
  }

  const [ , messageId ] = await withTry(postMessage)({
    _id: room._id,
    type: mimeType,
    content: "", 
    status: "LOADING"
  })

  if(!messageId) {
    message.info("消息发送失败")
    return 
  }

  const [ name ] = INSTANCE.add({
    file: {
      file,
    },
    request: {
      exitDataFn: exitDataFn((data) => {
        contentId = data?._id 
        isExists = data?.data == TOTAL_SIZE
      }),
      uploadFn,
      callback: async (err: any) => {
        if(!err) {
          if(mimeType === "VIDEO") {
            posterId = await uploadPoster(file)
            await withTry(putVideoPoster)({
              data: `${contentId}-${posterId}`
            })
          }
          await postCompleteMessage({
            _id: room._id,
            type: mimeType as API_CHAT.TMessageMediaType,
            content: contentId, 
            message_id: messageId, 
            status: "DONE"
          })
          success = true 
        }else {
          error = true 
        }
      }
    }
  })

  if(!name) {
    message.info('消息发送出错~')
    return 
  }

  INSTANCE.deal(name)

  return merge({}, defaultMessageData, {
    _id: messageId, 
    media_type: mimeType,
    createdAt: Day(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: Day(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    content,
    loading: true,
    status: 'upload',
    watch() {
      return watch(success, name, error)
    }
  })
}