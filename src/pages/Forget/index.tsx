import React, { useCallback, useMemo } from 'react'
import { message } from 'antd'
import ProForm, { ProFormText, ProFormCaptcha } from '@ant-design/pro-form'
import { MailOutlined, LockOutlined, MessageOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { sendEmail } from '@/services'
import { EMAIL_REGEXP } from '@/utils'
import { mapDispatchToProps, mapStateToProps } from './connect'

const Forget = (props: any) => {

  const { fetchForget } = useMemo(() => {
    return props 
  }, [props])

  const sendEmailMethod = useCallback(async (email) => {
    try {
      await sendEmail({
        email,
        type: "forget"
      })
      message.success(`邮箱 ${email} 验证码发送成功!`)
    }catch(err) {
      message.error(`邮箱 ${email} 验证码发送失败!`)
    }
  }, [])

  const onSubmit = useCallback(async (values) => {
    message.success('提交成功')
    await fetchForget(values)
  }, [])

  return (
    <div
      style={{
        width: 330,
        margin: 'auto',
      }}
    >
      <ProForm<API_USER.ILoginParams>
        onFinish={onSubmit}
        submitter={{
          searchConfig: {
            submitText: '提交',
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
          聊天室
        </h1>
        <div
          style={{
            marginTop: 12,
            textAlign: 'center',
            marginBottom: 40,
          }}
        >
          这里是快乐星球
        </div>
        <ProFormText
          fieldProps={{
            size: 'large',
            prefix: <MailOutlined />
          }}
          name="email"
          placeholder="请输入邮箱"
          rules={[
            {
              required: true,
              message: '请输入邮箱!',
            },
            {
              pattern: EMAIL_REGEXP,
              message: '不合法的手机号格式!',
            },
          ]}
        />
        <ProFormCaptcha
          fieldProps={{
            size: 'large',
            prefix: <MessageOutlined />
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
        <ProFormText.Password
          fieldProps={{
            type: "password",
            size: 'large',
            prefix: <LockOutlined />,
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

export default connect(mapStateToProps, mapDispatchToProps)(Forget)