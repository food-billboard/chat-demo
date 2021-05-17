import React, { useMemo } from 'react'
import { message } from 'antd'
import ProForm, { ProFormText, ProFormCaptcha } from '@ant-design/pro-form'
import { MobileOutlined, MailOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from './connect'

const Login = (props: {

}) => {

  const {  } = useMemo(() => {
    return props 
  }, [props])

  return (
    <div
      style={{
        width: 330,
        margin: 'auto',
      }}
    >
      <ProForm<API_USER.ILoginParams>
        onFinish={async (values) => {
          console.log(values)
          message.success('提交成功');
        }}
        submitter={{
          searchConfig: {
            submitText: '登录',
          },
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            size: 'large',
            style: {
              width: '100%',
            },
          },
        }}
      >
        <h1
          style={{
            textAlign: 'center',
          }}
        >
          <img
            style={{
              height: '44px',
              marginRight: 16,
            }}
            alt="logo"
            src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
          />
          Ant Design
        </h1>
        <div
          style={{
            marginTop: 12,
            textAlign: 'center',
            marginBottom: 40,
          }}
        >
          Ant Design 是西湖区最具影响力的 Web 设计规范
        </div>
        <ProFormText
          fieldProps={{
            size: 'large',
            prefix: <MobileOutlined />,
          }}
          name="mobile"
          placeholder="请输入手机号"
          rules={[
            {
              required: true,
              message: '请输入手机号!',
            },
            {
              pattern: /^1\d{10}$/,
              message: '不合法的手机号格式!',
            },
          ]}
        />
        <ProFormText
          fieldProps={{
            type: "password",
            size: 'large',
            prefix: <MobileOutlined />,
          }}
          name="password"
          placeholder="请输入密码"
          rules={[
            {
              required: true,
              message: '请输入密码!',
            },
          ]}
        />
      </ProForm>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)