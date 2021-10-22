import React, { memo, useEffect } from 'react'
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from './connect'
import styles from './index.less'

const Container = memo((props: any) => {

  const { getUserInfo } = props

  useEffect(() => {
    getUserInfo()
  }, [getUserInfo])

  return (
    <div className={styles["page-container"]}>
      {props.children}
    </div>
  )

})

export default connect(mapStateToProps, mapDispatchToProps)(Container)