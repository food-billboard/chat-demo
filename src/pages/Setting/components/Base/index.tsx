import { message, FormInstance } from 'antd'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import ProForm, { ProFormText, ProFormTextArea } from '@ant-design/pro-form'
import { connect } from 'react-redux'
import { Store } from 'antd/lib/form/interface'
import { merge } from 'lodash'
// import Upload from '@/components/Upload'
// import { fileValidator } from '../../DataEdit/utils'
import { mapStateToProps, mapDispatchToProps } from '../../connect'
import { PutUserInfo } from '@/services'
import { history } from '@/utils'
import styles from './index.less'

interface IProps {
  userInfo: STORE_USER.IUserInfo
}

const BaseView = (props: IProps) => {

  const viewRef = useRef<HTMLDivElement>(null)

  const { userInfo } = useMemo(() => {
    return props
  }, [props])

  const formRef = useRef<FormInstance>(null)

  const setBaseInfo = useCallback(() => {
    if (userInfo) {
      const { avatar, ...nextUserInfo } = userInfo
      formRef.current?.setFieldsValue(merge({}, nextUserInfo, {
        avatar: Array.isArray(avatar) ? avatar : [avatar]
      }))
    }
  }, [userInfo, formRef])

  const handlerSubmit = useCallback(async (values: Store) => {
    const { avatar, ...nextValues } = values
    await PutUserInfo(merge({}, nextValues, {
      avatar: Array.isArray(avatar) ? avatar[0] : avatar
    }) as API_USER.IPutUserInfoParams)
    formRef.current?.resetFields()
    return new Promise<boolean>((resolve) => {
      message.info("操作成功", 1, () => {
        history.replace('/main/room')
        resolve(true)
      })
    })
  }, [])

  useEffect(() => {
    setBaseInfo()
  }, [])

  return (
    <div className={styles.baseView} ref={viewRef}>
      <div className={styles.left}>
        <ProForm
          //@ts-ignore
          formRef={formRef}
          onFinish={handlerSubmit}
        >
          <ProFormText 
            label="邮箱" 
            name="email"
            rules={[
              {
                required: true,
                message: "请输入邮箱",
              },
            ]}
          />
          <ProFormText 
            label="用户名" 
            name="username"
            rules={[
              {
                required: true,
                message: "请输入用户名",
              },
            ]}
          />
          <ProFormTextArea 
            label="描述" 
            name="description"
            rules={[
              {
                required: true,
                message: "请输入描述",
              },
            ]}
          />
          <ProFormText
            name="mobile"
            label="手机号"
            rules={[
              {
                required: true,
                message: "请输入手机号",
              },
            ]}
            fieldProps={{
              type:"tel"
            }}
          />
          <ProFormText.Password 
            width="md" 
            name="password" 
            label="密码" 
          />
          {/* <Upload 
            wrapper={{
              label: '头像',
              name: 'avatar',
              rules: [
                {
                  required: true,
                  validator: fileValidator(1),
                  validateTrigger: 'onBlur'
                }
              ]
            }}
            item={{
              maxFiles: 1,
              acceptedFileTypes: ['image/*'],
              allowMultiple: false
            }}
          /> */}
        </ProForm>
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(BaseView)
