import React, { 
  memo, 
  useCallback, 
  useMemo, 
  forwardRef, 
  useImperativeHandle, 
  useState,
  useEffect
} from "react"
import { 
  Modal,
  Form,
  Radio,
  message,
  Select
} from 'antd'
import { getRelation } from '@/services'

export interface IRoomCreateModalRef {
  open: () => void 
}

const RoomCreateModal = memo(forwardRef<IRoomCreateModalRef, {
  onOk: (value: any) => void 
}>((props, ref) => {

  const [ visible, setVisible ] = useState<boolean>(false)
  const [ selectMode, setSelectMode ] = useState<any>("multiple")
  // const [ friendList, setFriendList ] = useState<API_USER.IGetFriendsRes[]>([])
  const [ friendList, setFriendList ] = useState<{ username: string, _id: string }[]>([])
  const [form] = Form.useForm()

  const { onOk: propsOnOk } = useMemo(() => {
    return props 
  }, [props])

  const onValuesChange = useCallback((value) => {
    if(value.type) {
      const members = form.getFieldValue('members')
      let newMembers: any  
      let mode = value.type === 'CHAT' ? undefined : "multiple"
      if(value.type === 'GROUP_CHAT') {
        newMembers = Array.isArray(members) ? members : [members]
      }else {
        newMembers = Array.isArray(members) ? members[0] : members
      }
      form.setFieldsValue({
        members: newMembers
      })   
      setSelectMode(mode)   
    }
    console.log(value)
  }, [form])

  const onOk = useCallback(async () => {
    return form.validateFields()
    .then(data => {
      console.log(data)
      propsOnOk(data)
      setVisible(false)
    })
    .catch(err => {
      console.log(err)
      message.info('请正确填写信息')
    }) 
  }, [form, propsOnOk])

  const onCancel = useCallback(() => {
    setVisible(false)
  }, [])

  const fetchData = useCallback(async () => {
    const data = await getRelation({
      currPage: 0,
      pageSize: 9999
    })
    // setFriendList(data.friends)
    setFriendList([
      {
        _id: '111',
        username: '2222'
      },
      {
        _id: '2222',
        username: '2244422'
      },
    ])
  }, [])

  const friendsOptions = useMemo(() => {
    return friendList.map(item => {
      const { _id, username } = item 
      return (
        <Select.Option key={_id} value={_id}>
          {username}
        </Select.Option>
      )
    })
  }, [friendList])

  useImperativeHandle(ref, () => {
    return {
      open: setVisible.bind(this, true)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Modal
      okText="确定"
      cancelText="取消"
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      title="创建聊天室"
    >
      <Form
        form={form}
        name="create-room-modal-form"
        initialValues={{
          type: "GROUP_CHAT",
          members: []
        }}
        onValuesChange={onValuesChange}
      >
        <Form.Item
          label="聊天室类型"
          rules={[{
            required: true,
            message: '请选择聊天室类型'
          }]}
          name="type"
        >
          <Radio.Group>
            <Radio key="GROUP_CHAT" value="GROUP_CHAT">群聊</Radio>
            <Radio key="CHAT" value="CHAT">单聊</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="成员选择"
          rules={[
            {
              required: true,
              message: '请选择成员'
            }
          ]}
          name="members"
        > 
          <Select
            allowClear
            mode={selectMode}
            placeholder="请选择成员"
          >
            {
              friendsOptions
            }
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )

}))

export default RoomCreateModal