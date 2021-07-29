import { Upload } from 'chunk-file-upload'
import { message } from 'antd'
import Day from 'dayjs'
import { checkUploadFile, uploadFile, getMediaData, putVideoPoster } from '@/services'
import { merge } from 'lodash'

const MAX_UPLOAD_FILE_SIZE = 1024 * 1024 * 5 

const INSTANCE = new Upload()

const VALID_FILE_TYPE = [
  "IMAGE",
  "VIDEO"
]

const exitDataFn = (params: {
  filename: string
  md5: string
  suffix: string
  size: number
  chunkSize: number
  chunksLength: number
}) => {
  const { size, suffix, md5, chunkSize } = params
  return checkUploadFile({
    auth: "PUBLIC",
    mime: suffix,
    chunk: chunkSize,
    md5,
    size,
    name: md5
  })
}

const uploadFn = (name: any) => async (data: FormData) => {
  const task = INSTANCE.getTask(name)
  const size = task.file.file.size 
  let response: any 
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

export const upload = (file: File, defaultMessageData: Partial<API_CHAT.IGetMessageDetailData>) => {
  let [ mimeType ] = file.type.toUpperCase().split('/')
  let success = false 
  if(!VALID_FILE_TYPE.includes(mimeType)) {
    message.info("文件格式不正确~")
    return 
  }
  let content: any  = {
    [mimeType!.toUpperCase()]: file,
  }
  if(mimeType === 'video') {
    content.poster = ''
  }
  const [ name ] = INSTANCE.add({
    file: {
      file,
      mime: mimeType
    },
    request: {
      exitDataFn,
      uploadFn,
      callback: (err: any) => {
        if(!err) {
          success = true 
        }
      }
    }
  })

  if(!name) {
    message.info('消息发送出错~')
    return 
  }

  // INSTANCE.deal(name)

  return merge({}, defaultMessageData, {
    _id: `__local_prefix_id_${Date.now()}_${Math.random()}__`, 
    media_type: mimeType,
    createdAt: Day(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: Day(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    content,
    loading: true,
    status: 'upload',
    watch() {
      if(!!success) {
        return {
          error: null,
          progress: 1,
          status: 4
        }
      }
      const result = INSTANCE.watch(name)
      if(!result || !result.length) return false 
      const [ target ] = result
      return {
        error: target?.error, 
        progress: target?.progress, 
        status: target?.status, 
      }
    }
  })
}