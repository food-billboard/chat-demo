import React, { memo, Fragment, useRef, useCallback, CSSProperties, useMemo } from 'react'
import { FileImageOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { merge, pick } from 'lodash'
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from './connect'
import { upload as Upload } from './upload'
import styles from './index.less'

const cursor: CSSProperties = {
  cursor: 'pointer',
  fontSize: 20
}

export type UploadProps = {
  icon: "video" | "image"
  onChange?: (value: API_CHAT.IPostMessageParams) => void 
  userInfo?: STORE_USER.IUserInfo
  socket?: any 
  currRoom?: API_CHAT.IGetRoomListData
  messageListDetailSave?: (value: any, insert: { insertBefore?: boolean, insertAfter?: boolean }) => Promise<void>
}

const ImageUpload = memo((props: UploadProps) => {

  const inputRef = useRef<any>(null)

  const { icon, userInfo, messageListDetailSave, currRoom, onChange: propsOnChange } = useMemo(() => {
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

  const onChange = useCallback(async (e) => {
    const file = e.target.files[0]
    const result = await Upload(file, currRoom!, {
      user_info: pick(userInfo || {}, [
        "username",
        "description",
        "friend_id",
        "member",
        "_id",
        "avatar"
      ]) as API_CHAT.IGetMessageDetailData["user_info"]
    }, propsOnChange)
    if(!result) return 
    await messageListDetailSave?.({
      message: [result],
      room: currRoom
    }, {
      insertAfter: true 
    })
  }, [userInfo, messageListDetailSave, currRoom, propsOnChange])

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