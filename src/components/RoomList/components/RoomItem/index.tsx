import React, { 
  memo, 
  useMemo, 
} from "react"
import { 
  Space, 
  Image, 
  Typography,
} from 'antd'
import { 
  FireOutlined, 
  UserOutlined, 
  DeleteOutlined
} from '@ant-design/icons'
import { noop, omit } from 'lodash-es'
import DeleteOperation from '../DeleteOperation'
import { IMAGE_FALLBACK } from '@/utils'
import styles from '../../index.less'

const { Title, Paragraph } = Typography

export interface IRoomItemProps extends API_CHAT.IGetRoomListData {
  prefix?: boolean
  onClick?: (item: API_CHAT.IGetRoomListData) => void 
}

const RoomItem = memo((props: IRoomItemProps) => {

  const Content = useMemo(() => {
    if(props.prefix) return null
    const { info: { name, description, avatar }, members, online_members, onClick=noop } = props 
    return (
      <div
        className={styles["room-icon-list-item-wrapper-content-container"]}
      >
        <div 
          className={styles["room-icon-list-item-wrapper-content-bg"]}
          style={{
            backgroundImage: `url(${avatar || IMAGE_FALLBACK})`
          }}
        ></div>
        <Image
          fallback={IMAGE_FALLBACK}
          src={avatar}
          width={"40%"}
          preview={false}
          onClick={onClick.bind(this, props)}
          wrapperStyle={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: 5,
            overflow: 'hidden'
          }}
        />
        <div
          style={{
            width: '58%',
            marginLeft: '2%',
          }}
          className={styles["white-text"]}
        >
          <Title style={{color: 'white'}} ellipsis level={4}>{name}</Title>
          <Paragraph style={{color: 'white'}} ellipsis={true}>
            {description || '这个房间什么也没留下'} 
          </Paragraph>
          <Space>
            <Space>
              <UserOutlined />
              {members}
            </Space>
            <Space>
              <FireOutlined />
              {online_members}
            </Space>
          </Space>
        </div>
        <DeleteOperation
          onShow={() => omit(props, ["prefix", "onClick"])}
        >
          <DeleteOutlined 
            style={{
              position: 'absolute',
              right: '1em',
              top: '0.1em',
              fontSize: '1.5em',
            }} 
          />
        </DeleteOperation>
      </div>
    )
  }, [props])

  return (
    <div
      className={styles["room-icon-list-item-wrapper-content-data"]}
    >
      {Content}
    </div>
  ) 
})

export default RoomItem