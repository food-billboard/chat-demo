import React, { memo, useCallback, useState, useEffect, useMemo, forwardRef, useRef, useImperativeHandle, Fragment } from "react"
import { Carousel, Popover, PopoverProps, Button, Input, Space, Image, Typography } from 'antd'
import { CarouselRef } from 'antd/es/carousel'
import { BankOutlined, FireOutlined, UserOutlined, LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons'
import { merge, noop } from 'lodash-es'
import { IMAGE_FALLBACK } from '@/utils'
import styles from './index.less'

const { Title, Paragraph } = Typography

interface IRoomItemProps extends API_CHAT.IGetRoomListData {
  prefix: boolean
  onClick?: (item: API_CHAT.IGetRoomListData) => void 
}

const RoomItem = memo((props: IRoomItemProps) => {

  const Content = useMemo(() => {
    if(props.prefix) return null
    const { info: { name, description, avatar }, members, online_members, onClick=noop } = props 
    return (
      <div
        className={styles["room-icon-list-item-wrapper-content-container"]}
        onClick={onClick}
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
          wrapperStyle={{
            display: 'flex',
            alignItems: 'center'
          }}
        />
        <div
          style={{
            width: '58%',
            marginLeft: '2%'
          }}
        >
          <Title ellipsis level={4}>{name}</Title>
          <Paragraph ellipsis={true}>
            {description}
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

interface IProps {
  style?: React.CSSProperties
}

interface IRoomListRef {
  searchValue: (value: string) => void 
}

const RoomList = memo(forwardRef<IRoomListRef, IProps>((props, ref) => {

  const PAGE_MAX_SIZE = 4

  const [ value, setValue ] = useState<API_CHAT.IGetRoomListData[]>([])

  const carouselRef = useRef<CarouselRef>(null)

  const { style={} } = useMemo(() => {
    return props 
  }, [props])

  const fetchData = useCallback(async () => {
    setValue(new Array(10).fill({
      _id: '1',  
      create_user: {
        _id: '111',
        username: '10'.repeat(10),
        avatar: "https://dss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=3878056340,2402291520&fm=218&app=92&f=PNG?w=121&h=75&s=6AA58B0ADE94B08AD3450CDB010050B3",
        description: "100".repeat(10), 
        member: "111111" 
      },
      info: {
        name: 'room0'.repeat(10),
        description: 'room0'.repeat(10),
        avatar: "https://dss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=3878056340,2402291520&fm=218&app=92&f=PNG?w=121&h=75&s=6AA58B0ADE94B08AD3450CDB010050B3",
      },
      members: 100, 
      is_delete: false, 
      createdAt: new Date().toString(), 
      updatedAt: new Date().toString(), 
      online_members: 100000 
    }).map((item, index) => ({ ...item, _id: index + Math.random() })))
  }, [])

  const list = useMemo(() => {
    return value.reduce((acc, cur, index) => {
      const len = acc.length 
      const currentIndex = len === 0 ? 0 : len - 1
      if(!acc[currentIndex]) acc[currentIndex] = []
      if(acc[currentIndex].length < PAGE_MAX_SIZE) {
        acc[currentIndex].push(cur)
      }else if(index < value.length) {
        acc[len] = [cur]
      }
      return acc 
    }, [] as API_CHAT.IGetRoomListData[][])
  }, [value])

  const domList = useMemo(() => {
    return list.map(item => {
      const newItem: any[] = [...item]
      if(newItem.length < PAGE_MAX_SIZE) newItem.push(...new Array(PAGE_MAX_SIZE - newItem.length).fill({
        _id: Date.now() + Math.random().toString(),
        prefix: true 
      }) as any[])
      return (
        <div className={styles["room-icon-list-item-wrapper"]} key={item[0]._id}>
          <div className={styles["room-icon-list-item-wrapper-content"]}>
            {
              newItem.map(item => {
                return (
                  <RoomItem key={item._id} {...item} />
                )
              })
            }
          </div>
        </div>
      )
    })
  }, [list])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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

}))

interface IWrapperProps extends IProps {
  popover?: Partial<PopoverProps>
  style?: React.CSSProperties
}

export default memo((props: IWrapperProps) => {

  const { popover, style={}, ...nextProps } = useMemo(() => {
    return props
  }, [props])

  const roomListRef = useRef<IRoomListRef>(null)

  const RoomListContent = useMemo(() => {
    return (
      <RoomList ref={roomListRef} {...nextProps} />
    )
  }, [nextProps])

  const searchRoom = useCallback((value: string) => {
    roomListRef.current?.searchValue(value)
  }, [roomListRef])

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
      </Space>
    )
  }, [searchRoom])

  return (
    <Popover
      overlayClassName={styles["room-list-popover"]}
      placement="rightBottom"
      title={Title}
      content={RoomListContent}
      trigger="click"
      {...popover}
    >
      <Button shape="circle" style={merge({}, { position: 'absolute', zIndex: 2, right: 12, top: '20vh' }, style)} icon={<BankOutlined />}></Button>
    </Popover>
  )

})