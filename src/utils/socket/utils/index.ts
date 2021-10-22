import { nanoid } from 'nanoid'

export const setStorage = (data: { [key: string]: any }) => {
  Object.entries(data).forEach(item => {
    const [ key, value ] = item
    let realValue = value 
    try {
      if(typeof value !== 'string') {
        realValue = JSON.stringify(realValue)
      }
      localStorage.setItem(key, realValue) 
    }catch(err) {}
  })
}

export const getStorage = (key?: string | string[]) => {
  let keys: string[]
  if(!key) {
    const len = localStorage.length
    keys = new Array(len).fill(0).map((_, index) => {
      const storageKey = localStorage.key(index)
      return storageKey as string 
    })
  }else {
    keys = Array.isArray(key) ? key : [key]
  }
  return keys.reduce((acc, cur) => {
    let value = localStorage.getItem(cur)
    acc[cur] = undefined
    try {
      if(!!value) acc[cur] = JSON.parse(value)
    }catch(err) {
      acc[cur] = value
    }
    return acc 
  }, {} as { [key: string]: any })
}

export const clearStorage = (key?: string | string[]) => {
  if(!key || !key.length) return localStorage.clear()
  let keys = Array.isArray(key) ? key : [key]
  keys.forEach(item => {
    localStorage.removeItem(item)
  })
}

const ACTION_STORAGE: {
  [key: string]: any 
} = {}

const getMethod = (type: "array" | "object", value: any) => {
  if(!value) return value 
  if(type === "array") {
    return Object.values(value)
  }
  return value 
}

export const actionGet = (key?: string, type: "array" | "object"="array") => {
  if(key) return getMethod(type, ACTION_STORAGE[key])
  return Object.entries(ACTION_STORAGE).reduce((acc, cur) => {
    const [ key, value ] = cur
    acc[key] = getMethod(type, value) 
    return acc 
  }, {} as any)
}

export const bindActionStorage = (key: string, action: any) => {
  if(!ACTION_STORAGE[key]) ACTION_STORAGE[key] = {}
  const uuid = nanoid()
  ACTION_STORAGE[key][uuid] = action 
  return uuid 
}

export const unBindActionStorage = (key: string, uuid: string) => {
  delete ACTION_STORAGE[key][uuid]
}