import React, { memo, useMemo, FC } from 'react'
import { Tooltip, Card, Avatar } from 'antd'
import { TooltipPropsWithTitle } from 'antd/es/tooltip'
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

  const { children, value, ...nextProps } = useMemo(() => {
    return props 
  }, [props])

  const CardData = useMemo(() => {

    const { avatar, username, description } = value

    return (
      <Card
        cover={
          <img
            alt={username}
            src={avatar || IMAGE_FALLBACK}
          />
        }
        actions={[]}
      >
        <Meta
          avatar={<Avatar src={avatar}>{username}</Avatar>}
          title={username}
          description={description || '这个人很懒，什么都没有留下'}
        />
      </Card>
    )
  }, [value])

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