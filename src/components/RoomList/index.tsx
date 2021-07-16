import React, { 
  memo, 
  useCallback, 
  useMemo, 
  forwardRef, 
  useRef, 
  useImperativeHandle, 
  Fragment,
  useState,
  useEffect
} from "react"
import { 
  Carousel, 
  Popover, 
  PopoverProps, 
  Button, 
  Input, 
  Space, 
  Image, 
  Typography,
  Tooltip, 
} from 'antd'
import { CarouselRef } from 'antd/es/carousel'
import { 
  BankOutlined, 
  FireOutlined, 
  UserOutlined, 
  LeftCircleOutlined, 
  RightCircleOutlined, 
  SettingOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import { merge, noop, omit } from 'lodash-es'
import { connect } from 'react-redux'
import RoomCreateModal, { IRoomCreateModalRef } from './components/RoomCreateModal'
import DeleteOperation from './components/DeleteOperation'
import { mapStateToProps, mapDispatchToProps } from './connect'
import { IMAGE_FALLBACK } from '@/utils'
import { formatRoomInfo } from '@/pages/RoomList/utils'
import styles from './index.less'

const { Title, Paragraph } = Typography

interface IRoomItemProps extends API_CHAT.IGetRoomListData {
  prefix?: boolean
  onClick?: (item: API_CHAT.IGetRoomListData) => void 
}

const RoomItem = memo((props: IRoomItemProps) => {

  const Content = useMemo(() => {
    if(props.prefix) return null
    const { info: { name, description, avatar }, members, online_members, onClick=noop } = props 
    return (
      <div
        className={styles["room-icon-list-item-wrapper-content-container"]}
      >
        <div 
          className={styles["room-icon-list-item-wrapper-content-bg"]}
          style={{
            backgroundImage: `url(${avatar || IMAGE_FALLBACK})`
          }}
        ></div>
        <Image
          fallback={IMAGE_FALLBACK}
          src={avatar}
          width={"40%"}
          preview={false}
          onClick={onClick.bind(this, props)}
          wrapperStyle={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: 5,
            overflow: 'hidden'
          }}
        />
        <div
          style={{
            width: '58%',
            marginLeft: '2%',
          }}
          className={styles["white-text"]}
        >
          <Title style={{color: 'white'}} ellipsis level={4}>{name}</Title>
          <Paragraph style={{color: 'white'}} ellipsis={true}>
            {description || '这个房间什么也没留下'} 
          </Paragraph>
          <Space>
            <Space>
              <UserOutlined />
              {members}
            </Space>
            <Space>
              <FireOutlined />
              {online_members}
            </Space>
          </Space>
        </div>
        <DeleteOperation
          onShow={() => omit(props, ["prefix", "onClick"])}
        >
          <DeleteOutlined 
            style={{
              position: 'absolute',
              right: '1em',
              top: '0.1em',
              fontSize: '1.5em',
            }} 
          />
        </DeleteOperation>
      </div>
    )
  }, [props])

  return (
    <div
      className={styles["room-icon-list-item-wrapper-content-data"]}
    >
      {Content}
    </div>
  ) 
})

interface IProps extends Pick<IRoomItemProps, 'onClick'> {
  style?: React.CSSProperties
  value?: API_CHAT.IGetRoomListData[]
  userInfo?: API_USER.IGetUserInfoResData
}

interface IRoomListRef {
  searchValue: (value: string) => void 
}

const RoomList = connect(mapStateToProps, mapDispatchToProps)(memo(forwardRef<IRoomListRef, IProps>((props, ref) => {

  const PAGE_MAX_SIZE = 4

  const carouselRef = useRef<CarouselRef>(null)
  const [ realList, setRealList ] = useState<API_CHAT.IGetRoomListData[]>([])

  const { style={}, value=[], onClick, userInfo } = useMemo(() => {
    return props 
  }, [props])

  const list = useMemo(() => {
    const realValue = (realList || [])
    return realValue.reduce((acc, cur, index) => {
      const len = acc.length 
      const currentIndex = len === 0 ? 0 : len - 1
      if(!acc[currentIndex]) acc[currentIndex] = []
      if(acc[currentIndex].length < PAGE_MAX_SIZE) {
        acc[currentIndex].push(cur)
      }else if(index < realList.length) {
        acc[len] = [cur]
      }
      return acc 
    }, [] as API_CHAT.IGetRoomListData[][])
  }, [realList])

  const fetchRealList = useCallback(async () => {
    let newList:API_CHAT.IGetRoomListData[]  = []
    for(let i = 0; i < value.length; i ++) {
      const item = value[i]
      const { type, _id } = item 
      const target = realList.find(item => item._id === _id)
      const data = await formatRoomInfo(item, userInfo!)
      if(data) {
        newList.push(target || data || item)
      }
    }
    setRealList(newList)
  }, [value, realList, userInfo])

  const domList = useMemo(() => {
    return list.map(item => {
      const newItem: any[] = [...item]
      if(newItem.length < PAGE_MAX_SIZE) newItem.push(...new Array(PAGE_MAX_SIZE - newItem.length).fill(0).map(() => {
        return {
          _id: Date.now() + Math.random().toString(),
          prefix: true 
        }
      }) as any[])
      return (
        <div className={styles["room-icon-list-item-wrapper"]} key={item[0]._id}>
          <div className={styles["room-icon-list-item-wrapper-content"]}>
            {
              newItem.map(item => {
                return (
                  <RoomItem onClick={onClick} key={item._id} {...item} />
                )
              })
            }
          </div>
        </div>
      )
    })
  }, [list, onClick])

  const searchValue = useCallback((value: string) => {
    const index = list.findIndex(item => {
      return item.some(data => {
        return (data.info?.name || '').includes(value) 
      })
    })
    if(!!~index) carouselRef.current?.goTo(index)
  }, [list, carouselRef])

  useImperativeHandle(ref, () => ({
    searchValue
  }), [searchValue])

  useEffect(() => {
    fetchRealList()
  }, [value])

  return (
    <div 
      className={styles["room-icon-list"]}
      style={style}
    >
      <Carousel
        arrows
        dots={false}
        prevArrow={<LeftCircleOutlined style={{fontSize: '2em'}} />}
        nextArrow={<RightCircleOutlined style={{fontSize: '2em'}} />}
        ref={carouselRef}
      >
        {domList}
      </Carousel>
    </div>
  )

})))

interface IWrapperProps extends Omit<IProps, "style"> {
  popover?: Partial<PopoverProps>
  style?: React.CSSProperties
  listStyle?: React.CSSProperties
  clickClose?: boolean 
}

export default memo((props: IWrapperProps) => {

  const [ visible, setVisible ] = useState<boolean>(false)

  const { popover, style={}, clickClose, onClick, ...nextProps } = useMemo(() => {
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
  }, [])

  const createRoom = useCallback((value: any) => {
    const { type, members } = value 
    createRoom({
      type,
      members: Array.isArray(members) ? members.join(',') : members
    })
  }, [])

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