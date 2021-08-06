import React, { memo } from 'react'
import {  } from 'antd'
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from './connect'
import './index.less'

interface SettingProps {
  userInfo?: STORE_USER.IUserInfo
}

const Setting = memo((props: SettingProps) => {

  return (
    <div>2222</div>
  )

})

export default connect(mapStateToProps, mapDispatchToProps)(Setting)