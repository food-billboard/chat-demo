import React, { memo, useMemo, FC, useCallback, useState, useImperativeHandle, forwardRef } from 'react'
import { Avatar } from 'antd'
import Day from 'dayjs'
import { CloseOutlined } from '@ant-design/icons'
import { connect } from 'react-redux' 
import classnames from 'classnames'
import UserDetail from '../../../UserDetail'
import ImageView from '../ViewImage'
import Video from '../../../Video'
import UploadLoading, { isUpload } from './uploadLoading'
import { mapStateToProps, mapDispatchToProps } from './connect'
import { IMAGE_FALLBACK } from '@/utils'
import styles from './index.less'

export interface VideoModalRef {
  open: (src: string) => void 
}

export const VideoModal = forwardRef((_, ref) => {

  const [ videoData, setVideoData ] = useState<string>()
  const [ visible, setVisible ] = useState<boolean>(false)

  const handleClose = useCallback(() => {
    setVisible(false)
    setVideoData("")
  }, [])

  const open = useCallback((src: string) => {
    setVisible(true)
    setVideoData(src)
  }, [])

  useImperativeHandle(ref, () => {
    return {
      open
    }
  }, [])

  return (
    <div
      className={classnames(styles["video-content"], {
        [styles["video-content-show"]]: visible
      })}
    > 
      <CloseOutlined className={styles["video-content-close"]} style={{color: 'white'}} onClick={handleClose} />
      <Video src={videoData} />
    </div>
  )

})

export type TMessageValue = API_CHAT.IGetMessageDetailData & { isMine?: boolean }

export interface IProps {
  value: TMessageValue[]
  style?: React.CSSProperties
  loading?: boolean 
  userInfo?: STORE_USER.IUserInfo
  fetchData: (params: Partial<{
    currPage: number 
    pageSize: number 
  }>) => Promise<void>
}

const ChatData: FC<{
  value: TMessageValue
  messageListDetailSave: (value: any, insert: { insertBefore?: boolean, insertAfter?: boolean }) => any 
  onVideoView?: (value: string) => Promise<void> 
}> = memo((props) => {

  const [ videoLoading, setViewLoading ] = useState<boolean>(false)

  const { 
    value,
    messageListDetailSave,
    onVideoView
  } = useMemo(() => {
    return props 
  }, [props])

  const {
    isMine,
    user_info: {
      avatar,
      _id,
      username,
      description
    },
    media_type,
    content,
    createdAt,
  } = useMemo(() => {
    return value 
  }, [value]) 

  const UserAvatar = useMemo(() => {
    const UserAvatar = (
      <Avatar shape="square" src={avatar}>{username}</Avatar>
    )
    if(isMine) return UserAvatar
    return (
      <UserDetail
        value={{
          avatar,
          username,
          description,
          _id
        }}
      >
        {UserAvatar}
      </UserDetail>
    )
  }, [avatar, username, isMine, description, _id])

  const onDataChange = useCallback(async (value) => {
    await messageListDetailSave({
      message: value
    }, { insertAfter: true })
  }, [messageListDetailSave])

  const handleView = useCallback(async (src?: string) => {
    if(onVideoView && src) {
      if(videoLoading) return 
      setViewLoading(true)
      await onVideoView(src)
      setViewLoading(false)
    }
  }, [videoLoading, onVideoView])

  const PopoverMessage = useMemo(() => {
    const { poster, image, text, video } = content 
    const margin = isMine ? { marginRight: 20 } : { marginLeft: 20 }
    return (
      <div
        className={styles["popover-chat"]}
        style={{
          ...margin,
          maxWidth: 'calc(100% - 84px)',
          backgroundColor: isMine ? 'rgb(28, 184, 78)' : 'white'
        }}
      >
        {
          media_type === 'AUDIO' && '语音消息'
        }
        {
          (media_type === 'IMAGE' || media_type === 'VIDEO') && (
            isUpload(value) ? (
              <UploadLoading
                value={value}
                onChange={onDataChange}
              />
            )
            :
            (
              <ImageView
                // disabled={!!loading}
                type={media_type}
                src={media_type === 'IMAGE' ? image! : (poster || IMAGE_FALLBACK)}
                onClick={handleView.bind(this, video)}
              />
            )
          )
        }
        {
          media_type === 'TEXT' && text!
        }
      </div>
    )
  }, [media_type, content, isMine, value, onDataChange, handleView])

  return (
    <div
      className={styles["chat-item-container"]}
    >
      { 
        !!createdAt && (
          <div className={styles["chat-item-date"]}>{Day(createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
        ) 
      }
      <div
        className={styles["chat-item-content"]}
        style={{justifyContent: isMine ? 'flex-end' : 'flex-start'}}
      >
        {
          isMine ? [PopoverMessage, UserAvatar] : [UserAvatar, PopoverMessage]
        }
      </div>
    </div>
  )

})

export default connect(mapStateToProps, mapDispatchToProps)(ChatData)