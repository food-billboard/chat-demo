import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import {  } from 'antd'

interface IProps {
  onObserve?: () => void 
}

export default memo((props: IProps) => {

  const [ observer, setObserver ] = useState<IntersectionObserver>()

  const { onObserve } = useMemo(() => {
    return props
  }, [props])

  const initObserver = useCallback(() => {
    const io = new IntersectionObserver(entries => {
      onObserve?.()
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