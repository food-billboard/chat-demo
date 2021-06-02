import React, { memo, useMemo, FC, useCallback } from 'react'
import { Tooltip, Card, Avatar } from 'antd'
import { TooltipPropsWithTitle } from 'antd/es/tooltip'
import { SettingOutlined, DeleteOutlined } from '@ant-design/icons'
import { IMAGE_FALLBACK } from '@/utils'
import styles from './index.less'

const { Meta } = Card

export interface IUserData {
  avatar: string 
  username: string 
  description?: string 
  _id: string 
}

export interface IProps extends Partial<TooltipPropsWithTitle>{
  children?: any
  value: IUserData
  actions?: React.ReactNode[]
}

const UserDetail: FC<IProps> = memo((props: IProps) => {

  const { children, value, actions, ...nextProps } = useMemo(() => {
    return props 
  }, [props])

  const handleSetting = useCallback((id: string) => {
    console.log('用户设置')
  }, [])

  const handleDelete = useCallback((id: string) => {
    console.log('用户删除')
  }, [])

  const CardData = useMemo(() => {

    const { avatar, username, _id, description } = value

    return (
      <Card
        cover={
          <img
            alt={username}
            src={avatar || IMAGE_FALLBACK}
          />
        }
        actions={actions || [
          <SettingOutlined key="setting" onClick={handleSetting.bind(this, _id)} />,
          <DeleteOutlined key="delete" onClick={handleDelete.bind(this, _id)} />
        ]}
      >
        <Meta
          avatar={<Avatar src={avatar}>{username}</Avatar>}
          title={username}
          description={description || '这个人很懒，什么都没有留下'}
        />
      </Card>
    )
  }, [value, actions])

  return (
    <Tooltip
      {...nextProps}
      title={CardData}
      color={'white'}
      overlayClassName={styles["user-detail-card"]}
      overlayStyle={{padding: 0}}
    >
      {children}
    </Tooltip>
  )

})

export default UserDetail