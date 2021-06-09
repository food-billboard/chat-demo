import React, { memo, useCallback, useMemo, useState } from 'react'
import { Input } from 'antd'
import { merge } from 'lodash-es'

const {  } = Input

interface IProps {
  style?: React.CSSProperties
}

export default memo((props: IProps) => {

  const [ value, setValue ] = useState<string>('')

  const { style={} } = useMemo(() => {
    return props 
  }, [props])

  const globalStyle = useMemo(() => {
    return merge({}, {
      width: '100%'
    }, style)
  }, [style])

  const onChange = useCallback((e) => {
    setValue(e.target.value)
  }, [])

  return (
    <div
      style={globalStyle}
    >
      <Input.TextArea style={{height: '100%'}} value={value} onChange={onChange} />
    </div>
  )

})