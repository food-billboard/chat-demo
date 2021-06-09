import React, { memo, useCallback } from 'react'
import { Button } from 'antd'
import { UpCircleOutlined } from '@ant-design/icons'

export default memo(() => {

  const onClick = useCallback(() => {

  }, [])

  return (
    <Button onClick={onClick} icon={<UpCircleOutlined />}></Button>
  )

})