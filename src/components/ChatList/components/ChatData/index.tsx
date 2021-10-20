import React, { memo, useMemo, FC, useCallback, useState, useImperativeHandle, forwardRef, useRef } from 'react'
import { Avatar } from 'antd'
import Day from 'dayjs'
import { CloseOutlined } from '@ant-design/icons'
import { connect } from 'react-redux' 
import classnames from 'classnames'
import UserDetail from '../../../UserDetail'
import ImageView from '../ViewImage'
import Video from '../../../Video'
import UploadLoading from './uploadLoading'
import { mapStateToProps, mapDispatchToProps } from './connect'
import { IMAGE_FALLBACK } from '@/utils'
import styles from './index.less'

export interface VideoModalRef {
  open: (src: string) => void 
}

export const VideoModal = forwardRef((_, ref) => {

  const [ videoData, setVideoData ] = useState<string>()
  const [ visible, setVisible ] = useState<boolean>(false)

  const videoRef = useRef<any>(null)

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
      <Video 
        src={videoData} 
        // @ts-ignore
        ref={videoRef as any} 
      />
    </div>
  )

})

export type TMessageValue = API_CHAT.IGetMessageDetailData & { isMine?: boolean }

export interface IProps {
  value: TMessageValue[]
  style?: React.CSSProperties
  loading?: boolean 
  userInfo?: STORE_USER.IUserInfo
  messageListDetail?: (socket: any, params: API_CHAT.IGetMessageDetailParams) => Promise<void>
}

const ChatData: FC<{
  value: TMessageValue
  messageListDetailSave: (value: any, insert: { insertBefore?: boolean, insertAfter?: boolean }) => any 
  onVideoView?: (value: string) => Promise<void> 
  currentRoom?: API_CHAT.IGetRoomListData
}> = memo((props) => {

  const [ videoLoading, setViewLoading ] = useState<boolean>(false)

  const { 
    value,
    messageListDetailSave,
    onVideoView,
    currentRoom
  } = props

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
  } = value

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
      message: value,
      room: currentRoom
    }, { insertAfter: true })
  }, [messageListDetailSave, currentRoom])

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
          backgroundColor: isMine ? 'rgb(28, 184, 78, 0.7)' : 'white'
        }}
      >
        {
          media_type === 'AUDIO' ? '语音消息' : (
            <UploadLoading
              value={value}
              onChange={onDataChange}
            >
              {
                media_type === "TEXT" ? text! : (
                  <ImageView
                    type={media_type}
                    src={media_type === 'IMAGE' ? image! : (poster || IMAGE_FALLBACK)}
                    onClick={handleView.bind(this, video)}
                  />
                )
              }
            </UploadLoading>
          )
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