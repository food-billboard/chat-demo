import React, { memo, useCallback, useState, CSSProperties, useMemo } from 'react'
import { Popover, Card, Space, Popconfirm, message } from 'antd'
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from './connect'

interface IDeleteOperationProps {
  children?: any 
  onShow: () => API_CHAT.IGetRoomListData 
}

const DeleteOperation = memo((props: IDeleteOperationProps) => {

  const [ roomInfo, setRoomInfo ] = useState<API_CHAT.IGetRoomListData>()

  const { children, onShow } = useMemo(() => {
    return props 
  }, [props])

  const deleteRoom = useCallback(async () => {
    if(!roomInfo) {
      message.info('房间信息错误')
      return 
    } 
    const {  } = roomInfo
    console.log('删除房间')
  }, [roomInfo])

  const quiteRoom = useCallback(async () => {
    if(!roomInfo) {
      message.info('房间信息错误')
      return 
    } 
    console.log('退出房间')
  }, [roomInfo])

  const DeleteWrapper = useCallback((action: (...args: any[]) => Promise<void>, children: any) => {
    return (
      <Popconfirm
        title="确定执行此操作吗?"
        onConfirm={action}
        okText="确定"
        cancelText="取消"
      >
        {children}
      </Popconfirm>
    )
  }, [])

  const Content = useMemo(() => {
    const gridStyle: CSSProperties = {
      width: '50%',
      textAlign: 'center',
      cursor: 'pointer',
      padding: 8
    }
    return (
      <Card>
        <Card.Grid style={gridStyle}>
          {
            DeleteWrapper(deleteRoom, (
              <div>
                <Space>
                  删除房间
                </Space>
              </div>
            ))
          }
        </Card.Grid>
        <Card.Grid style={gridStyle}>
          {
            DeleteWrapper(quiteRoom, (
              <div>
                <Space>
                  退出房间
                </Space>
              </div>
            ))
          }
        </Card.Grid>
      </Card>
    )
  }, [DeleteWrapper, deleteRoom, quiteRoom])

  const onVisibleChange = useCallback((visible: boolean) => {
    if(visible) {
      const data = onShow()
      setRoomInfo(data)
    }else {
      setRoomInfo(undefined)
    }
  }, [onShow])

  return (
    <Popover
      title="请选择操作"
      content={Content}
      onVisibleChange={onVisibleChange}
      trigger="click"
    >
      {children}
    </Popover>
  )

})

export default connect(mapStateToProps, mapDispatchToProps)(DeleteOperation)