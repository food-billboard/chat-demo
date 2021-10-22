import React, { 
  memo, 
  useCallback, 
  useMemo, 
  forwardRef, 
  useRef, 
  useImperativeHandle, 
  useState,
  useEffect
} from "react"
import { 
  Carousel, 
  Card
} from 'antd'
import { CarouselRef } from 'antd/es/carousel'
import {  
  LeftCircleOutlined, 
  RightCircleOutlined, 
} from '@ant-design/icons'
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from './connect'
import { formatRoomInfo } from '@/pages/RoomList/utils'
import RoomItem, { IRoomItemProps } from '../RoomItem'
import styles from '../../index.less'

export interface IProps extends Pick<IRoomItemProps, 'onClick'> {
  style?: React.CSSProperties
  value?: API_CHAT.IGetRoomListData[]
  userInfo?: API_USER.IGetUserInfoResData
  loading?: boolean 
}

export interface IRoomListRef {
  searchValue: (value: string) => void 
}

const RoomList = connect(mapStateToProps, mapDispatchToProps)(memo(forwardRef<IRoomListRef, IProps>((props, ref) => {

  const PAGE_MAX_SIZE = 4

  const carouselRef = useRef<CarouselRef>(null)
  const [ realList, setRealList ] = useState<API_CHAT.IGetRoomListData[]>([])

  const { style={}, value=[], onClick, userInfo, loading } = useMemo(() => {
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
      const { _id } = item 
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
    <Card 
      className={styles["room-icon-list"]}
      style={style}
      loading={!!loading}
      bordered={false}
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
    </Card>
  )

})))

export default RoomList