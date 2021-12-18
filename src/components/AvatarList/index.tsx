import React, { memo, useState, useEffect, useCallback, ReactNode } from 'react'
import { Avatar, Tooltip, Empty } from 'antd'
import { AvatarProps, GroupProps } from 'antd/es/avatar'

export type TAvatarData = {
  username: string 
  _id: string 
  avatar?: string 
}

interface IAvatarListProps {
  avatarProps?: Partial<AvatarProps & { tooltip?: true | ((dom: React.ReactNode, item: TAvatarData, props: Partial<AvatarProps>) => React.ReactNode) }>
  groupProps?: Partial<GroupProps>
  fetchData: () => Promise<TAvatarData[]>
  onClick?: (item: TAvatarData) => void 
  empty?: boolean | ReactNode
}

export default memo((props: IAvatarListProps) => {

  const [ value, setValue ] = useState<TAvatarData[]>([])

  const { avatarProps={}, groupProps={}, fetchData, onClick, empty } = props

  const internalFetchData = useCallback(async () => {
    const data = await fetchData()
    setValue(data)
  }, [fetchData])

  useEffect(() => {
    internalFetchData()
  // eslint-disable-next-line
  }, [])

  if(!value.length && !!empty) {
    return typeof empty === "boolean" ? (
      <Empty description={false} />
    ) : empty as any 
  }

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
          const avatarDom = (
            <div
              key={_id}
              onClick={onClick?.bind(this, item)}
            >
              <Avatar 
                style={{ backgroundColor: '#f56a00' }}
                alt={username}
                size="small"
                src={avatar}
                draggable
                {...nextProps}
              >
                {children || username}
              </Avatar>
            </div>
          )
          if(typeof tooltip === 'function') return tooltip(avatarDom, item, avatarProps)
          if(tooltip !== true) return avatarDom
          return (
            <Tooltip
              title={username}
              key={_id}
            >
              {avatarDom}
            </Tooltip>
          )
        })
      }
    </Avatar.Group>
  )

})