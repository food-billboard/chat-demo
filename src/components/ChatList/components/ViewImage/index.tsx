import React, { CSSProperties, memo, useCallback, useMemo } from 'react'
import { Image } from 'antd'
import classnames from 'classnames'
import { EyeOutlined, PlayCircleOutlined } from '@ant-design/icons'
import styles from './index.less'

interface IProps {
  src: string 
  type: 'IMAGE'| 'VIDEO'
  onClick?: () => any
  disabled?: boolean 
  style?: CSSProperties
  className?: string 
  uploading?: boolean 
}

export default memo((props: IProps) => {

  const { src, type, onClick, disabled, style, className, uploading } = props

  const preview = useMemo(() => {
    if(disabled || type === 'VIDEO') return false 
    const mask = (
      <EyeOutlined />
    )
    return {
      mask
    } 
  }, [type, disabled])

  const handleClick = useCallback(() => {
    if(uploading) return 
    onClick?.()
  }, [onClick, uploading])

  return (
    <div
      className={classnames(styles["chat-view-image-container"], className)}
      style={style}
      onClick={handleClick}
    >
      <Image
        preview={preview}
        src={src}
      />
      {
        type === 'VIDEO' && !uploading && (
          <div className={styles["chat-view-cover"]}>
            <PlayCircleOutlined />
          </div>
        )
      }
    </div>
  )

})