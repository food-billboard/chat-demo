// import { parse } from 'qs'
import { parse } from 'querystring'
import Day from 'dayjs'  
import { merge } from 'lodash'
import {
  API_DOMAIN
} from './constants'

export const getPageQuery = () => {
  return parse(window.location.href.split('?')[1])
}

// 处理query 传参的时候导致的空字符串查询问题（后端不愿意给处理）
export const formatQuery = (query: any ={})=>{
  let ret: any = {}
  Object.keys(query).map((key)=>{
    if( query[key] !== null && query[key] !== undefined && query[key]!=='' ){
      ret[key] = query[key]
    }
  })
  return ret
}

export function withTry<T=any> (func: Function) {
  return async function(...args: any[]): Promise<[any, T | null]> {
    try {
      const data = await func(...args)
      return [null, data]
    }catch(err) {
      return [err, null]
    }
  }
}

export async function sleep(time: number=1000) {
  return new Promise(resolve => setTimeout(resolve, time))
}

export const setLocalStorage = (key: string, value: any, timestamp: false | number=false) => {
  const data = JSON.stringify({
    data: value,
    ...(!timestamp ? {} : { timestamp: timestamp + Date.now() })
  })
  localStorage.setItem(key, data)
}

export const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key)
}

export const getLocalStorage = (key: string) => {
  const data = localStorage.getItem(key)
  if(!data) return undefined
  const realData: any = JSON.parse(data)
  const { timestamp, data: target } = realData
  const now = Date.now()
  if(!!timestamp) {
    if(now >= timestamp) {
      localStorage.removeItem(key)
      return undefined
    }
    return target
  }
  return target
}

export function formatUrl(url: string) {
  if(typeof url !== 'string') return url
  return url.startsWith('http') ? url : (url.startsWith('/') ? `${API_DOMAIN}${url}` : `${API_DOMAIN}/${url}`)
}

export const insertMessage = (origin: API_CHAT.IGetMessageDetailData[]=[], list: API_CHAT.IGetMessageDetailData[], insertAfter: boolean=true) => {
  let newList = list.sort((prev, next) => {
    const { createdAt: prevCreatedAt } = prev 
    const { createdAt: nextCreatedAt } = next
    return Day(prevCreatedAt).valueOf() - Day(nextCreatedAt).valueOf()
  })
  if(!origin.length) return [
    ...newList
  ]
  if(insertAfter) {
    const [ { createdAt: lastCreatedAt } ] = origin.slice(-1)
    const lastCreateDateValue = Day(lastCreatedAt).valueOf()
    newList = newList.filter(item => Day(item.createdAt).valueOf() > lastCreateDateValue)
    return [
      ...origin,
      ...newList
    ]
  }else {
    const [ { createdAt: firstCreatedAt } ] = origin
    const firstCreateDateValue = Day(firstCreatedAt).valueOf()
    newList = newList.filter(item => Day(item.createdAt).valueOf() < firstCreateDateValue)
    return [
      ...newList, 
      ...origin
    ]
  }
}