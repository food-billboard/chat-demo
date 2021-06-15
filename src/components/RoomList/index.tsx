import React, { memo, useCallback, useState, useEffect, useMemo } from "react"
import { Carousel } from 'antd'
import styles from './index.less'

const RoomItem = memo(() => {
  return (
    <div></div>
  ) 
})

export default memo(() => {

  const [ value, setValue ] = useState<any[]>([])

  const fetchData = useCallback(async () => {

  }, [])

  const list = useMemo(() => {
    return value.map(item => {
      return (
        <div className={styles["room-icon-list-item-wrapper"]}></div>
      )
    })
  }, [value])

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className={styles["room-icon-list"]}>
      <Carousel
        autoplay
      >
        {list}
      </Carousel>
    </div>
  )

})