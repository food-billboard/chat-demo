import React, { memo, useCallback, useMemo } from 'react'
import { Image } from 'antd'
import { EyeOutlined, PlayCircleOutlined } from '@ant-design/icons'
import styles from './index.less'

interface IProps {
  src: string 
  type: 'IMAGE'| 'VIDEO'
  onClick?: () => any
  disabled?: boolean 
}

export default memo((props: IProps) => {

  const { src, type, onClick, disabled } = useMemo(() => {
    return props 
  }, [props])

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
    onClick?.()
  }, [onClick])

  return (
    <div
      className={styles["chat-view-image-container"]}
      onClick={handleClick}
    >
      <Image
        preview={preview}
        src={src}
      />
      {
        type === 'VIDEO' && (
          <div className={styles["chat-view-cover"]}>
            <PlayCircleOutlined />
          </div>
        )
      }
    </div>
  )

})