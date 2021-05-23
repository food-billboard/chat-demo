import React, { memo, useCallback } from 'react'
import { Result, Button } from 'antd'
import { history } from '@/utils'

export default memo(() => {

  const back = useCallback(() => {
    return history.replace('/')
  }, [])

  return (
    <Result
      status="404"
      title="404"
      subTitle="对不起，当前页面未找到"
      extra={<Button type="primary" onClick={back}>回到首页</Button>}
    />
  )

})