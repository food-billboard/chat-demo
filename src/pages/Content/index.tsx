import React, { memo } from 'react'
import styles from './index.less'

export { default as SecurityContainer } from './container'

export default memo((props) => {

  return (
    <div
      className={styles["page-content"]}
    >
      {props.children}
    </div>
  )

})