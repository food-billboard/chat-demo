import React, { memo, useCallback, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { merge } from 'lodash-es'
import { mapStateToProps, mapDispatchToProps } from './connect'
import style from './index.less'

export default connect(mapStateToProps, mapDispatchToProps)(
  memo((props: any) => {

    const fetchData = useCallback(() => {
      return props.getUserInfo()
    }, [])

    useEffect(() => {
      fetchData()
    }, [])
  
    return (
      <div className={style["aa"]}>
        homepage
        <div>用户{props.userInfo.username}</div>
      </div>
    )
  
  })
)