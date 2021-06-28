import React, { memo, useMemo, useState, useEffect } from 'react'
import { Avatar, Tooltip } from 'antd'
import { AvatarProps, GroupProps } from 'antd/es/avatar'
import { UserOutlined, AntDesignOutlined } from '@ant-design/icons'
import { IMAGE_FALLBACK } from '@/utils'

type TAvatarData = {
  username: string 
  _id: string 
  avatar: string 
}

interface IAvatarListProps {
  avatarProps?: Partial<AvatarProps & { tooltip?: true | ((item: TAvatarData, props: Partial<AvatarProps>) => React.ReactNode) }>
  groupProps?: Partial<GroupProps>
  fetchData: () => Promise<TAvatarData[]>
  onClick?: (item: TAvatarData) => void 
}

export default memo((props: IAvatarListProps) => {

  const [ value, setValue ] = useState<TAvatarData[]>([])

  const { avatarProps={}, groupProps={}, fetchData, onClick } = useMemo(() => {
    return props 
  }, [props])

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Avatar.Group
      maxCount={10}
      maxPopoverPlacement="bottom"
      size="small"
      {...groupProps}
    >
      {
        value.map(item => {
          const { username, avatar, _id } = item 
          const { tooltip, children, ...nextProps } = avatarProps
          if(typeof tooltip === 'function') return tooltip(item, avatarProps)
          const avatarDom = (
            <Avatar 
              style={{ backgroundColor: '#f56a00' }}
              alt={username}
              size="small"
              srcSet={IMAGE_FALLBACK}
              src={avatar}
              key={_id}
              draggable
              {...nextProps}
            >
              {children || username}
            </Avatar>
          )
          if(tooltip !== true) return avatarDom
          return (
            <Tooltip
              title={username}
            >
              {avatarDom}
            </Tooltip>
          )
        })
      }
    </Avatar.Group>
  )

})