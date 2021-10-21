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
  scrollToBottom?: (times?: number) => Promise<void> 
}

export default memo((props: IProps) => {

  const [ value, setValue ] = useState<string>('')

  const { style={}, onPostMessage, scrollToBottom } = props

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
      if(!value.length) return 
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

  const preUpload = useCallback(async (value) => {
    scrollToBottom?.()
  }, [scrollToBottom])

  const ToolBar = useMemo(() => {
    return (
      <div className={styles["input-toolbar"]}>
        <div className={styles["input-toolbar-menu"]}>
          <Space size={20}>
          <EmojiPicker onSelect={handleSelectEmoji} />
            <Upload icon="image" onChange={onUpload} preUpload={preUpload} />
            <Upload icon="video" onChange={onUpload} preUpload={preUpload} />
          </Space>
        </div>
        <Button type="primary" style={{borderRadius: 10}} onClick={() => {
          handlePostMessage(false)
          scrollToBottom?.()
        }}>发送</Button>
      </div>
    )
  }, [handlePostMessage, handleSelectEmoji, onUpload, preUpload, scrollToBottom])

  const inputAction = useCallback((e: any) => {
    if((e.which === 13 && e.ctrlKey) || (e.which === 10 && e.ctrlKey)) {
      setValue(prev => prev + "\n")
    }else if((e.which === 13 && e.shiftKey) || (e.which === 10 && e.shiftKey)) {
      // TODO
    }else if(e.which === 13) {
      e.preventDefault()
      handlePostMessage(false)
      scrollToBottom?.()
    }
  }, [handlePostMessage, scrollToBottom])

  return (
    <div
      style={globalStyle}
    >
      {ToolBar}
      <Input.TextArea 
        style={{flex: 1}} 
        value={value} 
        onChange={onChange} 
        onKeyPress={inputAction}
      />
    </div>
  )

})