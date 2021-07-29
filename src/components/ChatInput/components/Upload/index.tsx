import React, { memo, Fragment, useRef, useCallback, CSSProperties, useMemo } from 'react'
import { FileImageOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { merge, pick } from 'lodash'
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from './connect'
import { upload as Upload } from './upload'
import PosterGetter from '@/utils/getVideoPoster'
import styles from './index.less'

const cursor: CSSProperties = {
  cursor: 'pointer',
  fontSize: 20
}

export type FileType = {

}

const posterGetter = new PosterGetter()

export type UploadProps = {
  icon: "video" | "image"
  onChange?: (value: FileType) => void 
  userInfo?: STORE_USER.IUserInfo
  socket?: any 
  currRoom?: API_CHAT.IGetRoomListData
  messageListDetailSave?: (value: any, insert: { insertBefore?: boolean, insertAfter?: boolean }) => Promise<void>
}

const ImageUpload = memo((props: UploadProps) => {

  const inputRef = useRef<any>(null)

  const { icon, userInfo, socket, messageListDetailSave } = useMemo(() => {
    return props 
  }, [props])

  const handleSelectFile = useCallback(() => {
    inputRef.current?.click()
  }, [inputRef])

  const IconNode = useMemo(() => {
    if(icon === 'image') return <FileImageOutlined style={cursor} onClick={handleSelectFile} />
    if(icon === 'video') return <VideoCameraOutlined style={cursor} onClick={handleSelectFile} />
  }, [icon, handleSelectFile])

  const inputFileProps = useMemo(() => {
    let defaultConfig = {
      type: "file",
      multiple: false 
    }
    if(icon === 'image') {
      defaultConfig = merge({}, defaultConfig, {
        accept: "image/*"
      })
    }
    if(icon === 'video') {
      defaultConfig = merge({}, defaultConfig, {
        accept: "video/*"
      })
    }
    return defaultConfig
  }, [icon])  

  const getPoster = useCallback((file: File) => {
    return posterGetter.start(file)
  }, [])

  const onChange = useCallback(async (e) => {
    const file = e.target.files[0]
    const result = Upload(file, {
      user_info: pick(userInfo || {}, [
        "username",
        "description",
        "friend_id",
        "member",
        "_id",
        "avatar"
      ]) as API_CHAT.IGetMessageDetailData["user_info"]
    })
    if(!result) return 
    await messageListDetailSave?.({
      message: [result]
    }, {
      insertAfter: true 
    })
    const data = await getPoster(file)
    console.log(data, 55555)
  }, [userInfo, messageListDetailSave])

  return (
    <Fragment>
      <input {...inputFileProps} ref={inputRef} className={styles["upload-input"]} onChange={onChange} />
      {
        IconNode
      }
    </Fragment>
  )

})

export default connect(mapStateToProps, mapDispatchToProps)(ImageUpload)