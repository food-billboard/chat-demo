import React, { CSSProperties, memo, useCallback, useMemo, useState } from 'react'
import { Input, Popover, Button, Space } from 'antd'
import { merge } from 'lodash-es'
import { Picker, EmojiData } from 'emoji-mart'
import { MehOutlined } from '@ant-design/icons'
import Upload, { UploadProps } from './components/Upload'
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

  const handleSelectEmoji = useCallback((value: EmojiData) => {
    setValue(prev => {
      return prev
    })
  }, [])

  const onUpload: UploadProps["onChange"] = useCallback((value) => {
    console.log(value, 24444)
  }, [])

  const ToolBar = useMemo(() => {
    const cursor: CSSProperties = {
      cursor: 'pointer',
      fontSize: 20
    }
    return (
      <div className={styles["input-toolbar"]}>
        <div className={styles["input-toolbar-menu"]}>
          <Space size={20}>
            <Popover
              content={<Picker onSelect={handleSelectEmoji} />}
              trigger="click"
            >
              <MehOutlined style={cursor} />
            </Popover> 
            <Upload icon="image" onChange={onUpload} />
            <Upload icon="video" onChange={onUpload} />
          </Space>
        </div>
        <Button type="primary" style={{borderRadius: 10}} onClick={handlePostMessage.bind(this, false)}>发送</Button>
      </div>
    )
  }, [handlePostMessage, handleSelectEmoji])

  return (
    <div
      style={globalStyle}
    >
      {ToolBar}
      <Input.TextArea style={{flex: 1}} value={value} onChange={onChange} onPressEnter={handlePostMessage.bind(this, false)} />
    </div>
  )

})