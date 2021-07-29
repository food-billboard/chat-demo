import React, { memo, useCallback, useMemo } from 'react'
import classnames from 'classnames'
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

  const handleClick = useCallback(() => {
    onClick && onClick()
  }, [onClick])

  return (
    <div
      className={styles["chat-view-image-container"]}
      onClick={handleClick}
    >
      <img src={src} className={styles["chat-view-image-container-item"]} alt="message" />
      <div className={classnames(styles["chat-view-cover"], {
        [`${styles['chat-view-image-cover']}`]: !disabled && type === 'IMAGE',
        [`${styles['chat-view-video-cover']}`]: !disabled && type === 'VIDEO'
      })}></div>
    </div>
  )

})