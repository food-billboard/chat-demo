import React, { memo, useCallback, useMemo, useState } from 'react'
import { Input, Button, Space } from 'antd'
import { merge } from 'lodash-es'
import { BaseEmoji } from 'emoji-mart'
import Upload, { UploadProps } from './components/Upload'
import EmojiPicker from './components/EmojiPicker'
import 'emoji-mart/css/emoji-mart.css'
import styles from './index.less'

type TMediaType = Pick<API_CHAT.IPostMessageParams, "content" | "type">
export interface IProps {
  style?: React.CSSProperties
  onPostMessage?: (params: TMediaType) => Promise<void>
}

export default memo((props: IProps) => {

  const [ value, setValue ] = useState<string>('')

  const { style={}, onPostMessage } = useMemo(() => {
    return props 
  }, [props])

  const globalStyle = useMemo(() => {
    return merge({}, {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    }, style)
  }, [style])

  const onChange = useCallback((e) => {
    setValue(e.target.value)
  }, [])

  const handlePostMessage = useCallback((media: false | TMediaType) => {
    let params: TMediaType 
    if(!media) {
      params = {
        type: "TEXT",
        content: value 
      }
    }else {
      params = media 
    }
    setValue('')
    onPostMessage?.(params)
  }, [value, onPostMessage])

  const handleSelectEmoji = useCallback((value: BaseEmoji) => {
    const native = value.native
    setValue(prev => {
      return prev + native
    })
  }, [])

  const onUpload: UploadProps["onChange"] = useCallback(async (value) => {
    handlePostMessage(value)
  }, [handlePostMessage])

  const ToolBar = useMemo(() => {
    return (
      <div className={styles["input-toolbar"]}>
        <div className={styles["input-toolbar-menu"]}>
          <Space size={20}>
          <EmojiPicker onSelect={handleSelectEmoji} />
            <Upload icon="image" onChange={onUpload} />
            <Upload icon="video" onChange={onUpload} />
          </Space>
        </div>
        <Button type="primary" style={{borderRadius: 10}} onClick={handlePostMessage.bind(this, false)}>发送</Button>
      </div>
    )
  }, [handlePostMessage, handleSelectEmoji, onUpload])

  return (
    <div
      style={globalStyle}
    >
      {ToolBar}
      <Input.TextArea style={{flex: 1}} value={value} onChange={onChange} onPressEnter={handlePostMessage.bind(this, false)} />
    </div>
  )

})