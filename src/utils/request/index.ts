import axios, { Method, AxiosRequestConfig, AxiosResponse } from 'axios'
import { BackTopProps, message, notification } from 'antd'
import { createBrowserHistory, createHashHistory } from 'history'
import { debounce } from 'lodash-es'
import { stringify } from 'querystring'
import Qs from 'qs'
import store, { fetchLogout } from '@/store'
import { formatQuery } from '../tool'

export const history: any = createHashHistory()

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
}

export interface IRequestOptions extends AxiosRequestConfig {
  mis?: boolean
  file?: boolean 
  authorization?: boolean 
}

const DEFAULT_REQUEST_SETTING: Partial<IRequestOptions> = {
  // baseURL: '',
  transformRequest: [function (data, headers) {
    // Do whatever you want to transform the data
    return data
  }],
  transformResponse: [function (data) {
    // Do whatever you want to transform the data
    return data
  }],
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  paramsSerializer: function (params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },
  timeout: 10000,
  withCredentials: true,
  responseType: 'json',
}

const axiosInstance = axios.create(DEFAULT_REQUEST_SETTING)

// axiosInstance.interceptors.request.use(
//   config => {

//     return config
//   },
//   error => {
//     // 处理请求错误
//     // console.log(error)
//     return Promise.reject(error)
//   }
// )

// axiosInstance.interceptors.response.use(

//   /**
//    * 通过自定义代码确定请求状态
//    */
//   response => {
//     const res = response.data
//     // 这里的error是后台返回给我的固定数据格式 可根据后端返回数据自行修改
//     const { error } = res;
//     // error不为null
//     if (error) {

//       // 弹出报错信息
//       Toast.fail({
//         icon: 'failure',
//         message: error.msg
//       })

//       // 后端返回code的报错处理
//       switch (error.code) {
//         case '1000':
//         case '1001':
//         case '1002':
//         case '1003':
//           router.replace({ path: '/error', query: { code: error.code, msg: error.msg } })
//           break;
//         case '6000':
//         case '6100':
//           // 清空Token 重新登录
//           store.dispatch('user/resetToken')
//           return Promise.reject(new Error(error.msg));
//         case '6200':
//         case '7000':
//         case '19000':
//         default:
//           // 如果状态码不是 则判断为报错信息
//           return Promise.reject(new Error(error.msg))
//       }
//     } else {
//       // 正常返回
//       return res
//     }

//   },
//   error => {
//     // 这里就是status网络请求的报错处理 主要处理300+ 400+ 500+的状态
//     console.error('err：' + error)
//     return Promise.reject(error)
//   }
// )

export const request = async <ResBody>(url: string, setting: IRequestOptions={}, origin: boolean=false): Promise<ResBody> => {
    // 过滤URL参数
    const { params, data, mis=true, file=false, authorization=false, ...options } = setting

    let body: any
    let error: any
  
    try{
      body = await axiosInstance(url, {
        ...options,
        ...(data ? { data: file ? data : Qs.stringify(data) } : {}),
        ...(params ? { params: formatQuery(params) } : {}),
      })
    } catch(err) {
      error = err
    }
  
    // 报错分为两种，
    // 系统错误，由 httpClient 拦截到的错误 如，4xx，5xx
    if( error ){
      error.errorType = 'system';
      error.messageType = 'response';
      mis && misManage(error, authorization);
      throw error
    }
  
    // 业务错误，客户端返回的 statusCode === 200 但是response.body 中的success 返回为 false的错误
    if( body && body?.data?.success === false ) {
      error = body
      error.errorType = 'logic'
      error.messageType = 'body'
    }
  
    // 返回真正的response body res 内容
    if( !error ){
      return (origin ? body : body?.data?.res?.data || {}) as ResBody
    }
    error.mis = mis
    mis && misManage(error, authorization)
    throw error
  }
  
  // 未登录的多次触发处理
  const dispatchLogin = debounce(function(err){
    const dispatch = store.dispatch
    const querystring = stringify({
      redirect: window.location.href,
    })
    history.replace(`/login?${querystring}`)
    dispatch(fetchLogout() as any)
    message.error(err.msg || '未登录请先登录');
  }, 1000, {'leading': true, 'trailing': false} )
  
  // 处理报错
  export const misManage = (error: any, authorization: boolean): any=>{
    if( error.messageType === 'body' ){
      const err = error.err || {}
  
      // 未登录处理
      if( authorization || (error.errorType === 'system' && err.code === '401') ){
        return dispatchLogin(err);
      }
      message.error(err.msg || '网络错误');
      return
    }
    const { response } = error;
    if( authorization || (response && response.status === 401) ){
      return dispatchLogin(error);
    }
    if (response && response.status) {
      const errorText = codeMessage[response.status as keyof typeof codeMessage] || response.statusText;
      const { status, url } = response;
      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: errorText,
      });
    } else if (!response) {
      notification.error({
        description: '您的网络发生异常，无法连接服务器',
        message: '网络异常',
      });
    }
}