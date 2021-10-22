import React, { Component, ReactNode } from 'react'
import { message, Progress as AntProgress } from 'antd'
import { merge } from 'lodash'
import classnames from 'classnames'
import { getMessageDetail } from '@/services'
import styles from './index.less'

export function isUpload(value: API_CHAT.IGetMessageDetailData) {
  const { loading, status } = value
  return !(!loading || !status || status === 'DONE')
}

export interface ProgressProps {
  onChange: (value: API_CHAT.IGetMessageDetailData[]) => void 
  value: API_CHAT.IGetMessageDetailData
  children?: (state: { uploading: boolean }) => ReactNode
}

const getLoading = (result: any) => {
  const { status, progress, error } = result 
  const numberStatus = Number(status)
  const numberProgress = Number(progress)
  let data: any = {
    loading: numberProgress !== 1 || (numberStatus !== -1 && numberStatus !== -2 && numberStatus !== -3 && numberStatus !== 4),
    status: numberProgress === 1 ? null : (
      !!error ? 'error' : "upload"
    ),
  }
  if(!data.status) {
    data = merge({}, data, {
      loading: null,
      watch: null,
    })
  } 
  return data 
}

class Progress extends Component<ProgressProps> {

  private timer: any

  state = {
    percent: 0,
    mediaSize: []
  }

  componentDidMount = () => {
    const { value } = this.props
    if(value.status === "upload") {
      this.timer = setInterval(this.fetchData, 1000)
    }
  }

  componentWillUnmount = () => {
    this.clearInterval()
  }

  clearInterval = () => {
    clearInterval(this.timer)
  }

  fetchRealMessage = async (params: API_CHAT.IGetMessageDetailParams) => {
    return getMessageDetail(params)
    .then(data => {
      return data.message
    })
    .catch(_ => {
      return [] as API_CHAT.IGetMessageDetailData[]
    })
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
    if(!newValue.status || newValue.status === 'error') {
      this.clearInterval()
      if(newValue.status === 'error') {
        message.info('消息发送失败')
      }else {
        this.fetchRealMessage({
          messageId: newValue._id
        })
        .then(data => {
          onChange(data.map(item => merge({}, item, { loading: false })))
        })
        return 
      }
    }
    onChange([newValue])
  }

  isError = () => {
    const { value: { status } } = this.props
    return status?.toUpperCase() === 'error'
  }

  isLoading = () => {
    const { value: { loading } } = this.props
    return !!loading && !this.isError()
  }

  isMedia = (value: ProgressProps["value"]) => {
    return value.media_type === "IMAGE" || value.media_type === "VIDEO"
  }

  getPoster = (value: ProgressProps["value"]) => {
    if(!this.isMedia(value)) return null 
    return value.content.image || value.content.poster
  }

  render() {

    const { percent } = this.state 
    const { children, value } = this.props 

    if(!isUpload(value)) return children?.({ uploading: false })
    
    const loading = this.isLoading()
    const error = this.isError()

    return (
      <div 
        className={classnames(styles["upload-progress-wrapper"], {
          [styles["upload-progress-wrapper-pre"]]: this.isMedia(value)
        })}
      >
        {
          !!loading && (
            children?.({ uploading: true })
          )
        }
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
                format={_ => `发送中...`}
              />
            )
          }
          {
            !!error && (
              <div></div>
            )
          }
        </div>
      </div>
    )
  }

}

export default Progress