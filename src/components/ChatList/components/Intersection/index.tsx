import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import {  } from 'antd'

interface IProps {
  onIntersection?: () => void 
}

export default memo((props: IProps) => {

  const [ observer, setObserver ] = useState<IntersectionObserver>()

  const { onIntersection } = useMemo(() => {
    return props
  }, [props])

  const initObserver = useCallback(() => {
    const io = new IntersectionObserver(entries => {
      console.log(entries)
      onIntersection && onIntersection()
    }, {
      root: document.querySelector('#chat-list-wrapper')
    })
    setObserver(io)
    const target = document.querySelector('#intersection-observer')
    target && io.observe(target)
  }, [])

  useEffect(() => {
    initObserver()
    return () => {
      observer?.disconnect()
    }
  }, [])

  return (
    <div id="intersection-observer">loading...</div>
  )

})