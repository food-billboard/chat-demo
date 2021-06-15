

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

export const clearStorate = (key?: string | string[]) => {
  if(!key || !key.length) return localStorage.clear()
  let keys = Array.isArray(key) ? key : [key]
  keys.forEach(item => {
    localStorage.removeItem(item)
  })
}