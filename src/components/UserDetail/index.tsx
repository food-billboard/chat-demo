import React, { memo, useMemo, FC } from 'react'
import { Tooltip, Card, Avatar } from 'antd'
import { TooltipPropsWithTitle } from 'antd/es/tooltip'
import type { CardProps, CardMetaProps } from 'antd/es/card'
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

export const CardData = (props: IUserData & Partial<CardProps> & { metaProps?: Partial<CardMetaProps> }) => {

  const { avatar, username, description, metaProps={}, ...nextProps } = props

    return (
      <Card
        cover={
          <img
            alt={username}
            src={avatar || IMAGE_FALLBACK}
          />
        }
        actions={[]}
        {...nextProps}
      >
        <Meta
          avatar={<Avatar src={avatar}>{username}</Avatar>}
          title={username}
          description={description || '这个人很懒，什么都没有留下'}
          {...metaProps}
        />
      </Card>
    )
}

const UserDetail: FC<IProps> = memo((props: IProps) => {

  const { children, value, ...nextProps } = useMemo(() => {
    return props 
  }, [props])

  return (
    <Tooltip
      {...nextProps}
      title={<CardData {...value} />}
      color={'white'}
      overlayClassName={styles["user-detail-card"]}
      overlayStyle={{padding: 0}}
    >
      {children}
    </Tooltip>
  )

})

export default UserDetail