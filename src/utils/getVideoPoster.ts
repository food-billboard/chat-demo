import { merge } from 'lodash-es'
import mime from 'mime'

class PosterGetter {

  type: string = 'image/jpeg'
  timer!: NodeJS.Timer
  file: File | null = null 
  url: string = ''
  canvas!: HTMLCanvasElement | null 
  context: CanvasRenderingContext2D | null = null 
  video: HTMLVideoElement | null = null 
  filename: string = ''
  size = {
    width: 100,
    height: 100 
  }

  init = () => {
    clearTimeout(this.timer)
    this.video = this.video || document.createElement("video")
    this.url = URL.createObjectURL(this.file)
    this.video.src = this.url
    this.canvas = this.canvas || document.createElement("canvas")
    this.context = this.context || this.canvas.getContext('2d')
    return new Promise((resolve, reject) => {
      this.video!.onloadeddata = async (e) => {
        try {
          const data = await this.generate()
          resolve(data)
        }catch(err) {
          reject(err)
        }
      }
    })
    .then(data => {
      this.video!.onloadeddata = null 
      return data 
    })
  }

  start = (file: File, size: Partial<{
    width: number 
    height: number 
  }>={}, type="image/jpeg", filename?: string) => {
    this.file = file 
    this.size = merge({}, this.size, size)
    this.type = type 
    this.filename = filename || this.file.name + '_image_' + Date.now() + '.' + mime.getExtension(this.type)
    return this.init()
  }

  generate = async () => {
    const { width, height } = this.size
    if(this.video) {
      this.context?.drawImage(this.video, 0, 0, width, height)
      this.revokeUrl()
      return new Promise((resolve, reject) => {
        this.canvas!.toBlob((result) => {
          if(result) return resolve(result)
          return reject("file parse error")
        }, this.type)
      })
      .then((data: any) => {
        this.clear()
        return new File([data], this.filename, {
          type: this.type
        })
      })
    }
  }

  revokeUrl = () => {
    URL.revokeObjectURL(this.url)
    this.size = {
      width: 100,
      height: 100 
    }
  }

  clear = () => {
    this.timer = setTimeout(() => {
      this.video?.removeEventListener('loadeddata', this.generate)
      this.canvas = null 
      this.context = null 
      this.video = null 
      this.file = null 
    }, 3000)
  }

}

export default PosterGetter

// canvas.width = this.videoWidth
// 		canvas.height = this.videoHeight
// 		width = this.videoWidth
// 		height = this.videoHeight
// 		ctx.drawImage(this, 0, 0, width, height);
// 		var src = canvas.toDataURL('image/jpeg');
// 		img.src = src;

// 		// var currentTime = this.currentTime
// 		// duration = this.duration
// 		// var fps = duration / 30
		