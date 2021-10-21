import React, { useMemo, CSSProperties } from 'react'
import { Affix, Button } from 'antd'
import { VerticalAlignBottomOutlined, DownOutlined } from '@ant-design/icons'
import styles from './index.less'

const BackToBottom = ({
  onClick,
  type="icon",
  style
}: { onClick: any, type: "icon" | "message", style?: CSSProperties }) => {

  const content = useMemo(() => {
    if(type === "icon") {
      return (
        <Button onClick={onClick} shape="circle" icon={<VerticalAlignBottomOutlined />}></Button>
      )
    }
    return (
      <div onClick={onClick} className={styles["to-new-message-icon"]}>
        <DownOutlined style={{marginRight: 8}} />你有新消息
      </div>
    )
  }, [type, onClick])

  return (
    <Affix style={{ position: 'fixed', bottom: '40vh', right: 12, ...style }}>
      {content}
    </Affix>
  )

}

export default BackToBottom