import React, { memo, useMemo, CSSProperties } from 'react'
import { Popover } from 'antd'
import { Picker, PickerProps } from 'emoji-mart'
import { MehOutlined } from '@ant-design/icons'
import locale from './locale'
import styles from './index.less'

const cursor: CSSProperties = {
  cursor: 'pointer',
  fontSize: 20
}

const EmojiPicker = memo((props: PickerProps) => {

  const Content = useMemo(() => {
    return (
      <Picker 
        i18n={locale}
        exclude={["people", "custom", "search"]}
        showPreview={false}
        {...props} 
      />
    )
  }, [props])

  return (
    <Popover
      content={Content}
      trigger="click"
      overlayClassName={styles["emoji-picker-pop"]}
    >
      <MehOutlined style={cursor} />
    </Popover> 
  )

})

export default EmojiPicker