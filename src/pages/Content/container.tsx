import React, { memo, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from './connect'
import styles from './index.less'

const Container = memo((props: any) => {

  const { getUserInfo } = useMemo(() => {
    return props 
  }, [props])

  useEffect(() => {
    getUserInfo()
  }, [])

  return (
    <div className={styles["page-container"]}>
      {props.children}
    </div>
  )

})

export default connect(mapStateToProps, mapDispatchToProps)(Container)