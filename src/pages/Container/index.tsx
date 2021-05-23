import React, { memo } from 'react'
import styles from './index.less'

const Container = memo((props: any) => {

  return (
    <div className={styles["page-container"]}>
      {props.children}
    </div>
  )

})

export default Container