// import { parse } from 'qs'
import { parse } from 'querystring'
import Day from 'dayjs'  
import { merge, omit } from 'lodash-es'
import {
  API_DOMAIN
} from './constants'

export const getPageQuery = () => {
  return parse(window.location.href.split('?')[1])
}

// 处理query 传参的时候导致的空字符串查询问题（后端不愿意给处理）
export const formatQuery = (query: any ={})=>{
  let ret: any = {}
  Object.keys(query).forEach((key) => {
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

function contentMerge(origin: API_CHAT.IGetMessageDetailData["content"], target: API_CHAT.IGetMessageDetailData["content"]): API_CHAT.IGetMessageDetailData["content"] {
  return {
    text: target.text || origin.text,
    image: target.image || origin.image,
    video: target.video || origin.video,
    audio: target.audio || origin.audio,
    poster: target.poster || origin.poster,
  }
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
  let newOriginList = [
    ...origin
  ]
  if(insertAfter) {
    const [ { createdAt: lastCreatedAt, _id: originLastId } ] = origin.slice(-1)
    const lastCreateDateValue = Day(lastCreatedAt).valueOf()
    let toAddListIndex = newList.findIndex(item => {
      return Day(item.createdAt).valueOf() > lastCreateDateValue && item._id !== originLastId
    })
    let commonList: any[] = []
    let toAddList: any[] = []
    if(!!~toAddListIndex) {
      commonList = newList.slice(0, toAddListIndex)
      toAddList = newList.slice(toAddListIndex)
    }else {
      commonList = newList.slice()
    }
    commonList.forEach(item => {
      const { createdAt, _id: newId } = item
      const createdAtValue = Day(createdAt).valueOf()
      for(let i = origin.length - 1; i >= 0; i --) {
        const originTarget = origin[i]
        const { _id, createdAt } = originTarget
        const prevCreateAtValue = Day(createdAt).valueOf()
        if(prevCreateAtValue + 1000 < createdAtValue) break 
        if(_id === newId) {
          newOriginList[i] = merge({}, omit(originTarget, ["content"]), omit(item, ["content"]), {
            content: contentMerge(originTarget.content, item.content)
          }) as API_CHAT.IGetMessageDetailData
        }
      }
    })
    return [
      ...newOriginList,
      ...toAddList
    ]
  }else {
    const [ { createdAt: firstCreatedAt } ] = origin
    const firstCreateDateValue = Day(firstCreatedAt).valueOf()
    const tempNewList = [...newList].reverse()
    const toAddListIndex = tempNewList.findIndex(item => {
      return Day(item.createdAt).valueOf() <= firstCreateDateValue 
    })
    let commonList: any[] = []
    let toAddList: any[] = []
    if(!!~toAddListIndex) {
      commonList = tempNewList.slice(0, toAddListIndex + 1).reverse()
      toAddList = tempNewList.slice(toAddListIndex + 1).reverse()
    }else {
      commonList = newList.slice()
    }
    commonList.forEach(item => {
      const { createdAt, _id: newId } = item
      const createdAtValue = Day(createdAt).valueOf()
      for(let i = 0; i < origin.length; i ++) {
        const originTarget = origin[i]
        const { _id, createdAt } = originTarget
        const prevCreateAtValue = Day(createdAt).valueOf()
        if(prevCreateAtValue + 1000 > createdAtValue) break 
        if(_id === newId) {
          newOriginList[i] = merge({}, omit(originTarget, ["content"]), omit(item, ["content"]), {
            content: contentMerge(originTarget.content, item.content)
          }) as API_CHAT.IGetMessageDetailData
        }
      }
    })
    return [
      ...toAddList,
      ...newOriginList,
    ]
  }
}