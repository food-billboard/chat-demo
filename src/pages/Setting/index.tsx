import React, { Component } from 'react'
import { Card } from 'antd'
import { connect } from 'react-redux'
import classnames from 'classnames'
import BaseView from './components/Base'
import { mapDispatchToProps, mapStateToProps } from './connect'
import styles from './index.less'

interface IProps {
  getUserInfo: () => Promise<API_USER.IGetUserInfoResData>
  userInfo: STORE_USER.IUserInfo
  loading: boolean
}

class Settings extends Component<IProps> {

  async componentDidMount() {
    const { getUserInfo } = this.props
    if(getUserInfo) await getUserInfo()
  }

  render() {

    return (
      <div className={styles["setting-card"]}>
        <Card
          className={classnames(styles["setting-card-size"])}  
        >
          <BaseView />
        </Card>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
