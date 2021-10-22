import React, { memo, useCallback, useState } from 'react'
import { Popconfirm, message } from 'antd'
import { connect } from 'react-redux'
import { withTry } from '@/utils' 
import { quitRoom as quitRoomMethod } from '@/utils/socket'
import { mapStateToProps, mapDispatchToProps } from './connect'

interface IDeleteOperationProps {
  children?: any 
  onShow: () => API_CHAT.IGetRoomListData 
  socket: any 
  roomList?: (...args: any) => any
  messageList?: (socket: any) => Promise<any>
}

const DeleteOperation = memo((props: IDeleteOperationProps) => {

  const [ roomInfo, setRoomInfo ] = useState<API_CHAT.IGetRoomListData>()

  const { children, onShow, socket, roomList, messageList } = props

  const roomValid = useCallback((roomInfo?: API_CHAT.IGetRoomListData) => {
    if(!roomInfo) {
      message.info('房间信息错误')
      return 
    } 
    return true 
  }, [])

  // const deleteRoom = useCallback(async () => {
  //   if(roomValid(roomInfo)) {
  //     const { _id } = roomInfo!
  //     const [err, value] = await withTry(deleteRoomMethod)(socket, { _id })
  //     if(err) {
  //       message.info("删除房间错误")
  //     }
  //   }
  // }, [roomInfo, roomValid, socket])

  const quiteRoom = useCallback(async () => {
    if(roomValid(roomInfo)) {
      const { _id } = roomInfo!
      const [err, value] = await withTry(quitRoomMethod)(socket, { _id })
      if(err || !value.length) {
        message.info("删除房间错误")
      }else {
        roomList?.(socket)
        messageList?.(socket)
      }
    }
  }, [roomInfo, roomValid, socket, roomList, messageList])

  // const DeleteWrapper = useCallback((action: (...args: any[]) => Promise<void>, children: any) => {
  //   return (
  //     <Popconfirm
  //       title="确定执行此操作吗?"
  //       onConfirm={action}
  //       okText="确定"
  //       cancelText="取消"
  //     >
  //       {children}
  //     </Popconfirm>
  //   )
  // }, [])

  // const Content = useMemo(() => {
  //   const gridStyle: CSSProperties = {
  //     width: '50%',
  //     textAlign: 'center',
  //     cursor: 'pointer',
  //     padding: 8
  //   }
  //   return (
  //     <Card>
  //       <Card.Grid style={gridStyle}>
  //         {
  //           DeleteWrapper(deleteRoom, (
  //             <div>
  //               <Space>
  //                 删除房间
  //               </Space>
  //             </div>
  //           ))
  //         }
  //       </Card.Grid>
  //       <Card.Grid style={gridStyle}>
  //         {
  //           DeleteWrapper(quiteRoom, (
  //             <div>
  //               <Space>
  //                 退出房间
  //               </Space>
  //             </div>
  //           ))
  //         }
  //       </Card.Grid>
  //     </Card>
  //   )
  // }, [DeleteWrapper, deleteRoom, quiteRoom])

  const onVisibleChange = useCallback((visible: boolean) => {
    if(visible) {
      const data = onShow()
      setRoomInfo(data)
    }else {
      setRoomInfo(undefined)
    }
  }, [onShow])

  return (
    <Popconfirm
      title="确定退出房间吗?"
      onConfirm={quiteRoom}
      okText="确定"
      cancelText="取消"
      onVisibleChange={onVisibleChange}
    >
      {children}
    </Popconfirm>
  )

  // return (
  //   <Popover
  //     title="请选择操作"
  //     content={Content}
  //     onVisibleChange={onVisibleChange}
  //     trigger="click"
  //   >
  //     {children}
  //   </Popover>
  // )

})

export default connect(mapStateToProps, mapDispatchToProps)(DeleteOperation)