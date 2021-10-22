import React, { useCallback, useEffect, useMemo } from 'react'
import { message } from 'antd'
import ProForm, { ProFormText } from '@ant-design/pro-form'
import { MobileOutlined, LockOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { redirectPage } from '@/store'
import { history, getPageQuery } from '@/utils'
import { mapStateToProps, mapDispatchToProps } from './connect'
import styles from './index.less'

const replaceGoto = () => {
  setTimeout(() => {
    redirectPage()
    // const query = getPageQuery()

    // const { search={} } = history.location
    // const { redirect } = search as { redirect: string }
    // if (!redirect) {
    //   history.replace('/home')
    //   return
    // }
    // history.replace(redirect)
  }, 10)
};

const Login = (props: any) => {

  const { fetchLogin, isLogin } = useMemo(() => {
    const { userInfo, ...nextProps } = props
    return {
      ...nextProps,
      isLogin: !!userInfo && !!userInfo._id
    } 
  }, [props])

  const onSubmit = useCallback(async (values) => {
    await fetchLogin(values)
    message.success('提交成功')
  }, [])

  const goToRegister = useCallback(() => {
    history.push('/register')
  }, [])

  useEffect(() => {
    if(isLogin) replaceGoto()
  }, [isLogin])

  return (
    <div
      style={{
        width: 330,
        margin: 'auto',
        padding: '32px 0 24px'
      }}
    >
      <ProForm<API_USER.ILoginParams>
        onFinish={onSubmit}
        onReset={goToRegister}
        submitter={{
          searchConfig: {
            submitText: '登录',
            resetText: '注册',
          },
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            size: 'large',
            style: {
              width: '100%',
            },
          }
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
            prefix: <MobileOutlined color="red" />,
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
        <ProFormText.Password
          fieldProps={{
            type: "password",
            size: 'large',
            prefix: <LockOutlined />
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
      <div className={styles.other}>
        <Link className={styles.register} to="/forget">
          忘记密码
        </Link>
        <Link className={styles.register} to="/register">
          注册账户
        </Link>
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)