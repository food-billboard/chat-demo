import React, { useCallback, useMemo, useState } from 'react'
import { message } from 'antd'
import ProForm, { ProFormText, ProFormCaptcha } from '@ant-design/pro-form'
import { MobileOutlined, MailOutlined } from '@ant-design/icons'
import { connect, useStore } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { sendEmail } from '@/services'
import { mapDispatchToProps, mapStateToProps } from './connect'

const Register = (props: {

}) => {

  const {  } = useMemo(() => {

    return props 
  }, [props])

  const sendEmailMethod = useCallback(async (email) => {
    try {
      await sendEmail({
        email,
        type: "register"
      })
      message.success(`邮箱 ${email} 验证码发送成功!`)
    }catch(err) {
      message.error(`邮箱 ${email} 验证码发送失败!`)
    }
  }, [])

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
            submitText: '注册',
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
          name="username"
          placeholder="请输入用户名"
        />
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
        <ProFormText
          fieldProps={{
            size: 'large',
            prefix: <MobileOutlined />,
          }}
          name="email"
          placeholder="请输入邮箱"
          rules={[
            {
              required: true,
              message: '请输入邮箱!',
            },
            {
              pattern: /^1\d{10}$/,
              message: '不合法的手机号格式!',
            },
          ]}
        />
        <ProFormCaptcha
          fieldProps={{
            size: 'large',
            prefix: <MailOutlined />,
          }}
          captchaProps={{
            size: 'large',
          }}
          countDown={120}
          phoneName="email"
          name="captcha"
          rules={[
            {
              required: true,
              message: '请输入验证码',
            },
          ]}
          placeholder="请输入验证码"
          onGetCaptcha={sendEmailMethod}
        />
      </ProForm>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)