import React, { 
  memo, 
  useCallback, 
  useMemo, 
  useRef, 
  Fragment,
  useState,
} from "react"
import { 
  Popover, 
  PopoverProps, 
  Button, 
  Input, 
  Space, 
  Tooltip, 
} from 'antd'
import { 
  BankOutlined, 
  SettingOutlined,
} from '@ant-design/icons'
import { merge, omit } from 'lodash-es'
import { connect } from 'react-redux'
import RoomList, { IProps, IRoomListRef } from './components/RoomList'
import RoomCreateModal, { IRoomCreateModalRef } from './components/RoomCreateModal'
import { mapStateToProps, mapDispatchToProps } from './connect'
import { createRoom as createRoomMethod } from '@/utils/socket/request'
import styles from './index.less'


interface IWrapperProps extends Omit<IProps, "style"> {
  popover?: Partial<PopoverProps>
  style?: React.CSSProperties
  listStyle?: React.CSSProperties
  clickClose?: boolean 
  socket?: any 
  roomList?: (socket: any, params?: API_CHAT.IGetRoomListParams) => Promise<void>
}

const Room = memo((props: IWrapperProps) => {

  const [ visible, setVisible ] = useState<boolean>(false)

  const { popover, style={}, clickClose, onClick, socket, roomList, ...nextProps } = useMemo(() => {
    return props
  }, [props])

  const roomListRef = useRef<IRoomListRef>(null)
  const roomCreteModalRef = useRef<IRoomCreateModalRef>(null)

  const searchRoom = useCallback((value: string) => {
    roomListRef.current?.searchValue(value)
  }, [roomListRef])

  const createChatRoom = useCallback(() => {
    setVisible(false)
    roomCreteModalRef.current?.open()
  }, [roomCreteModalRef])

  const Title = useMemo(() => {
    return (
      <Space direction="horizontal">
        房间列表
        <Input.Search 
          prefix={<BankOutlined />} 
          onSearch={searchRoom} 
          allowClear
          enterButton
          size="small"
        />
        <Tooltip
          title="创建聊天室"
        >
          <SettingOutlined onClick={createChatRoom} />
        </Tooltip>
      </Space>
    )
  }, [searchRoom, createChatRoom])

  const onSelectClick = useCallback((item: API_CHAT.IGetRoomListData) => {
    if(!!clickClose) setVisible(false)
    onClick?.(item)
  }, [onClick, clickClose])

  const onVisibleChange = useCallback((visible) => {
    setVisible(visible)
    roomList?.(socket)
  }, [roomList, socket])

  const createRoom = useCallback(async (value: any) => {
    const { type, members } = value 
    await createRoomMethod(socket, {
      type,
      members: Array.isArray(members) ? members.join(',') : members
    })
    await roomList?.(socket)
  }, [socket, roomList])

  return (
    <Fragment>
      <Popover
        overlayClassName={styles["room-list-popover"]}
        placement="rightBottom"
        title={Title}
        content={
          <RoomList ref={roomListRef} {...omit(nextProps, ['listStyle'])} style={nextProps.listStyle || {}} onClick={onSelectClick} />
        }
        trigger="click"
        visible={visible}
        onVisibleChange={onVisibleChange}
        {...popover}
      >
        <Button shape="circle" style={merge({}, { position: 'absolute', zIndex: 2, right: 12, top: '20vh' }, style)} icon={<BankOutlined />}></Button>
      </Popover>
      <RoomCreateModal
        ref={roomCreteModalRef}
        onOk={createRoom}
      />
    </Fragment>
  )

})

export default connect(mapStateToProps, mapDispatchToProps)(Room)