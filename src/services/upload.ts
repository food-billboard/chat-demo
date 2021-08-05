import { merge } from 'lodash'
import { request } from '@/utils'
import { encoder } from '@/utils/string2arraybuffer'

export const deleteFile = (params: API_UPLOAD.IDeleteParams) => {
  return request('/api/customer/upload', {
    method: 'DELETE',
    params
  })
}

export const loadFile = (params: API_UPLOAD.ILooadParams) => {
  return request(`/api/customer/upload?${Object.entries(params).reduce((acc, cur) => {
    const [ key, value ] = cur
    acc += `${key}=${value}&`
    return acc
  }, '').slice(0, -1)}`, {
    method: 'GET'
  })
}

//媒体获取
export const getMediaList = (params: API_UPLOAD.IGetMediaListParams) => {
  return request<API_UPLOAD.IGetMediaListRes>('/api/manage/media', {
    method: 'GET',
    params
  })
}

function string2Base64(str: string) {
  return encoder(str)
}

const DEFAULT_CHECK_UPLOAD_PARAMS = {
  auth: 'PUBLIC',
  chunk: 1024 * 1024 * 5
}

function mergeMetaData(params: { [key: string]: any }) {
  const data = Object.entries(params).reduce((acc, cur) => {
    const [ key, value ] = cur
    const realValue = typeof value === 'string' ? value : value.toString()
    acc.push(`${key} ${string2Base64(realValue)}`)
    return acc 
  }, [] as any)
  return {
    'Upload-Metadata': data.join(',')
  }
}

export const checkUploadFile = async (params: Partial<API_UPLOAD.ICheckUploadFileParams>) => {
  const newParams = merge({}, DEFAULT_CHECK_UPLOAD_PARAMS, params)
  return request<{ headers: API_UPLOAD.ICheckUploadFileRes, [key: string]: any }>('/api/customer/upload', {
    method: 'HEAD', 
    headers: merge({}, { "Tus-Resumable": "1.0.0" }, mergeMetaData(newParams))
  }, true)
  .then(data => {
    const { headers } = data as any 
    const offset = headers["upload-offset"] ?? headers["Upload-Offset"]
    const fileId = headers["upload-id"] ?? headers["Upload-Id"]
    return {
      data: offset,
      _id: fileId
    }
  })
}

export const uploadFile = async (params: API_UPLOAD.IUploadParams) => {
  const { file, offset, ...nextParams } = params 
  return request<{ headers: { "Upload-Offset": number }, [key: string]: any }>('/api/customer/upload/weapp', {
    method: 'POST', 
    headers: merge({}, { "Tus-Resumable": "1.0.0", "Upload-Offset": offset, "content-type": "application/offset+octet-stream" }, mergeMetaData(nextParams)),
    data: file,
    file: true 
  }, true)
  .then(data => {
    const { headers } = data as any 
    const nextOffset = headers["upload-offset"] ?? headers["Upload-Offset"]
    return {
      data: nextOffset
    }
  })

}

export const getMediaData = async (query: API_UPLOAD.IGetMediaDataParams) => {
  return request<string>('/api/customer/upload', {
    method: 'GET', 
    params: query,
  })
}

export const putVideoPoster = async (data: API_UPLOAD.IPutVideoPosterParams) => {
  return request('/api/customer/upload/video/poster', {
    method: 'PUT', 
    data,
  })
}

