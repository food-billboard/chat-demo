import React, { useRef, useState, useEffect, useCallback } from 'react'
import { message } from 'antd'
import { Upload as TusUpload, isSupported, PreviousUpload, HttpRequest } from 'tus-js-client'
import { supported, FilePondFile, FilePondErrorDescription, RevertServerConfigFunction, ProcessServerConfigFunction, FilePondInitialFile as IInitFileType } from 'filepond'
import { FilePond, registerPlugin, FilePondProps } from 'react-filepond'
import FilePondPluginFileRename from 'filepond-plugin-file-rename'
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginFilePoster from 'filepond-plugin-file-poster'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import pick from 'lodash/pick'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { withTry } from '@/utils'
import Wrapper from '@/components/WrapperItem'
import { loadFile } from '@/services'
import china from './locale'
import { encryptionFile, sleep, toBase64, propsValueValid, isObjectId } from './util'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

interface IExtraMetaData {
  md5: string
  objectId: string
}

interface IProps extends FilePondProps {
  value: Array<string>
  onChange: (...args: any[]) => any
}

interface ReactFC<TProps> extends React.FC<TProps> {
  valid: (value: string[], length: number) => boolean
} 

interface IValue extends IInitFileType {
  local?: {
    _id?: string
    md5?: string
  }
}

registerPlugin(
  FilePondPluginFileRename, 
  FilePondPluginFileValidateSize, 
  FilePondPluginFileValidateType, 
  FilePondPluginFilePoster, 
  FilePondPluginImagePreview
)

const CHUNK_SIZE = 1024 * 1024 * 5

const filepondSupport = supported()
const tusSupport = isSupported

export type FilePondInitialFile = IInitFileType

const Upload: ReactFC<IProps> = ({
  value: propsValue=[],
  ...props
}) => {

  const uploadRef = useRef<FilePond | null>(null)

  const [ value, setValue ] = useState<IValue[]>([])
  const [ isMessaging, setIsMessaging ] = useState<boolean>(false)

  //?????????????????????????????????
  const onAddFile = async (fileObj: FilePondFile) => {
    if(!isMessaging) {
      setIsMessaging(true)
      message.info('???????????????...', 1, () => {
        setIsMessaging(false)
      })
    }
    if(Object.prototype.toString.call(fileObj.file) !== '[object File]') return true

    const chunkSize = props.chunkSize || CHUNK_SIZE

    await sleep(300)

    const [ , md5 ] = await withTry(encryptionFile)(fileObj.file, chunkSize)

    if(!md5) {
      uploadRef.current?.removeFile(fileObj)
      message.info('??????????????????????????????')
      return false
    }
    fileObj.setMetadata('md5', md5)

    return true

  }

  //??????????????????
  const revert: RevertServerConfigFunction = async (__, load, _) => load()

  //??????
  const process: ProcessServerConfigFunction = async (fieldName, file, metadata, load, error, progress, abort) => {

    const { md5 } = metadata
    const uploadMetadata: { [key: string]: string | number } = {
      md5,
      size: file.size,
      mime: file.type,
      chunk: CHUNK_SIZE,
      auth: 'PUBLIC',
    }

    const upload = new TusUpload(file, {
      endpoint: "/api/customer/upload",
      uploadUrl: "/api/customer/upload",
      chunkSize: CHUNK_SIZE,
      uploadLengthDeferred: false,
      addRequestId: true,
      //?????????????????????????????????????????????????????????
      //??????localstorage??????
      urlStorage: {
        findAllUploads: (): Promise<PreviousUpload[]> => Promise.resolve([]),
        findUploadsByFingerprint: (_: string): Promise<PreviousUpload[]> => Promise.resolve([]),
        removeUpload: (_: string): Promise<void> => Promise.resolve(),
        // Returns the URL storage key, which can be used for removing the upload.
        addUpload: (_: string, __: PreviousUpload): Promise<string> => Promise.resolve('')
      },
      onBeforeRequest: function (req: HttpRequest) {
        const xhr = req.getUnderlyingObject()
        xhr.withCredentials = true
    
        const method = req.getMethod().toLowerCase()
        let metadata:any = {}
        
        if(method === 'head') {
          metadata = uploadMetadata
        }else if(method === 'patch') {
          metadata = pick(uploadMetadata, [ 'md5', 'auth' ])
        }

        //?????????????????????????????????
        req.setHeader('Upload-Metadata', Object.keys(metadata).reduce((acc: string, cur: string) => {
          acc += `${cur} ${toBase64(metadata[cur])},`
          return acc
        }, '').slice(0, -1))
  
      },
      onAfterResponse: function (req, res) {
        const method = req.getMethod().toLowerCase()
        //??????????????????id
        if(method === 'head') {
          const id = res.getHeader('Upload-Id')

          setValue(prevValue => {
            const restValue = prevValue.filter(val => {
              return typeof val === 'object' && val.local?._id !== id
            })
            const newValue = new Array(prevValue.length - restValue.length + 1).fill({
              source: id,
              local: {
                _id: id,
                md5,
              },
              options: {
                type: 'input',
                file: {
                  name: file.name,
                  size: file.size,
                  type: file.type,
                }
              }
            })
            return [
              ...restValue,
              ...newValue
            ]
          })
        }
      },
      //???????????????id
      fingerprint: (file, options) => {
        let md5
        const wrapperFile = uploadRef.current?.getFile(fieldName) 
        if(!wrapperFile) {
          md5 = fieldName
        }else {
          md5 = (wrapperFile.getMetadata() as IExtraMetaData).md5
        }
        return Promise.resolve(md5)
      },
      //@ts-ignore
      //?????????
      onShouldRetry: () => false,
      onError: function(err: Error) {
        error(err.message)
        setValue(prevValue => {
          return prevValue.map(val => {
            if(val.local?.md5 !== md5) return val
            return {
              ...val,
              local: {
                ...val.local as { md5: string },
                _id: undefined
              }
            }
          })
        })
      },
      //???????????? ??????onProgress ?????????????????????
      onChunkComplete: function(bytesUploaded:number, bytesTotal:number) {
        progress(true, bytesUploaded, bytesTotal)
      },
      onSuccess: function() {
        load(fieldName)
      }
    })

    upload.start()

    return {
      abort: () => {
        upload.abort()
        abort()
      }
    }
  }

  const onremovefile = useCallback((error: FilePondErrorDescription | null, file: FilePondFile) => {
    if(error) return 
    const source = file.source
    let newValue
    if(typeof source === 'string') {
      newValue = value.filter(val => val.source !== source)
    }else {
      const { md5 } = file.getMetadata()
      newValue = value.filter(val => val.local?.md5 !== md5)
    }
    setValue(newValue)
  }, [value])

  const isExists: (props: string[], state: IValue[], target: string) => boolean = useCallback((props, state, target) => {
    const stateLen = state.filter(item => item.local?._id === target).length
    const propsLen = props.filter(item => item === target).length
    return stateLen === propsLen
  }, [])

  //????????????id
  const fetchFileId = useCallback(async (file: string) => {
    if(isObjectId(file)) return file 
    const [ err, data ] = await withTry(loadFile)({ load: encodeURIComponent(file) })
    if(err) return file 
    return data
  }, [])

  //?????????id
  const formatValue = useCallback(async (value: string[] | string):Promise<string[]> => {
    let _value = Array.isArray(value) ? value : [ value ]
    let newValues:string[] = []
    for(let i = 0; i < _value.length; i ++) {
      let targetValue = _value[i]
      if(!isObjectId(targetValue)) {
        targetValue = await fetchFileId(targetValue)
      }
      newValues.push(targetValue)
    }
    return newValues
  }, [fetchFileId])

  useEffect(() => {
    formatValue(propsValue)
    .then(propsValue => {
      setValue(prevValue => {
        let internalList: IValue[] = [ ...prevValue ]
        propsValue.forEach(file => {
          if(!isExists(propsValue, prevValue, file)) {
            uploadRef.current?.addFile(file, {
              type: 'local'
            })
            internalList.push({ source: file, options: { type: 'local' }, local: { _id: file } })
          }
        })
        return internalList
      })
    })
    // eslint-disable-next-line
  }, [ propsValue, uploadRef ])

  useDeepCompareEffect(() => {
    let validFiles: string[] = []
    value.forEach((file) => {
      const id = file.local?._id
      if(!!id) validFiles.push(id)
    })
    props.onChange && props.onChange(validFiles)
  }, [value])

  return (
    filepondSupport && tusSupport ?
      <FilePond 
        required
        checkValidity
        ref={uploadRef}
        allowMultiple={true} 
        server={{
          url: '/api/customer/upload',
          process,
          revert,
        }}
        //@ts-ignore
        maxFileSize={'300MB'}
        instantUpload={false}
        chunkRetryDelays={[1000]}
        chunkUploads
        chunkSize={CHUNK_SIZE}
        itemInsertInterval={200}
        // onaddfile={onAddFile}
        beforeAddFile={onAddFile}
        onremovefile={onremovefile}
        {...china}
        {...props}
      />
    :
    null
  )

}

Upload.valid = propsValueValid

export {
  Upload
}

export default Wrapper<FilePondProps>(React.memo(Upload))
