import React from 'react'
import { Affix, Button } from 'antd'
import { VerticalAlignBottomOutlined } from '@ant-design/icons'

const BackToBottom = ({
  onClick 
}: { onClick: any }) => {

  return (
    <Affix style={{ position: 'fixed', bottom: '40vh', right: 12 }}>
      <Button onClick={onClick} shape="circle" icon={<VerticalAlignBottomOutlined />}></Button>
    </Affix>
  )

}

export default BackToBottom