import { history } from '@/utils'

export default function(images: string | string[], event: any) {
  if(!images) return 
  let list = Array.isArray(images) ? images : [images]
  return history.push('/media/image', {
    query: {
      url: list,
    },
  })
}

