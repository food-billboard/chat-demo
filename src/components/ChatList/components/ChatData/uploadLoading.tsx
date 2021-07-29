import React, { Component } from 'react'
import { Progress as AntProgress } from 'antd'
import { merge, omit } from 'lodash'
import styles from './index.less'

export interface ProgressProps {
  onChange: (value: API_CHAT.IGetMessageDetailData) => void 
  value: API_CHAT.IGetMessageDetailData
}

// enum ECACHE_STATUS {
//   pending = 0,
//   waiting = 1,
//   reading = 2,
//   uploading = 3,
//   fulfilled = 4,
//   rejected = -3,
//   cancel = -2,
//   stopping = -1,
// }

const getLoading = (result: any) => {
  const { status, progress, error } = result 
  let data: any = {
    loading: progress != 1 || !error || status != -1 || status != -2 || status != -3 || status != 4,
    status: progress == 1 ? undefined : (
      !!error ? 'error' : "upload"
    )
  }
  if(!data.status) {
    data = merge({}, data, {
      loading: undefined,
      watch: undefined,
    })
  } 
}

class Progress extends Component<ProgressProps> {

  private timer: any

  state = {
    percent: 0
  }

  componentDidMount = () => {
    this.timer = setInterval(this.fetchData, 1000)
  }

  componentWillUnmount = () => {
    this.clearInterval()
  }

  clearInterval = () => {
    clearInterval(this.timer)
  }

  fetchData = () => {
    const { value, onChange } = this.props
    const { watch } = value  
    const result = watch?.() 
    let newValue = {...value}
    if(!result) {
      newValue = merge({}, newValue, {
        loading: false,
        status: 'error'
      })
    }else {
      newValue = merge({}, newValue, getLoading(result))
      this.setState({
        percent: result.progress * 100
      })
    }
    if(!newValue.status) {
      this.clearInterval()
    }
    onChange(newValue)
  }

  render() {

    const { percent } = this.state 
    const { value: { loading } } = this.props

    return (
      <div className={styles["upload-progress-wrapper"]}>
        <div className={styles["upload-progress-shadow"]}>
          {
            !!loading && (
              <AntProgress 
                showInfo={false} 
                type="circle" 
                percent={percent} 
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }} 
              />
            )
          }
        </div>
      </div>
    )
  }

}

export default Progress