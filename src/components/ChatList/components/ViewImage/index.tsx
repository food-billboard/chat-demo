import React, { memo, useCallback, useMemo } from 'react'
import classnames from 'classnames'
import styles from './index.less'

interface IProps {
  src: string 
  type: 'IMAGE'| 'VIDEO'
  onClick?: () => any
}

export default memo((props: IProps) => {

  const { src, type, onClick } = useMemo(() => {
    return props 
  }, [])

  const handleClick = useCallback(() => {
    onClick && onClick()
  }, [])

  return (
    <div
      className={styles["chat-view-image-container"]}
      onClick={handleClick}
    >
      <img src={src} className={styles["chat-view-image-container-item"]} />
      <div className={classnames(styles["chat-view-cover"], {
        [`${styles['chat-view-image-cover']}`]: type === 'IMAGE',
        [`${styles['chat-view-video-cover']}`]: type === 'VIDEO'
      })}></div>
    </div>
  )

})