import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle, memo } from 'react'
import Videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js'
import { getMediaList } from '@/services'
import { isObjectId } from './util'
import 'video.js/dist/video-js.css'
import './index.less'

interface IVideoRef {
  reload(): void
  pause(): void 
}

interface IProps extends VideoJsPlayerOptions {}

const Video: React.FC<IProps> = forwardRef<IVideoRef & VideoJsPlayer, IProps>((props, ref) => {

  const [ instance, setInstance ] = useState<VideoJsPlayer>()

  useImperativeHandle(ref, () => ({
    ...instance!,
    reload,
  }))

  const eventBinding: (instance: VideoJsPlayer) => void = useCallback((instance) => {
    instance.on('timeupdate', function() {
      // const currTime: number = instance.currentTime()
      // const duration: number = instance.duration()
      // console.log(currTime, duration)
    })

    instance.on("loadstart",function(data){
      // console.log("开始请求数据 ", data);
    })
    instance.on("progress",function(){
        // console.log("正在请求数据 ");
    })
    instance.on("loadedmetadata",function(data){
      // console.log(data)
        // console.log("获取资源长度完成 ")
    })
    instance.on("canplaythrough",function(){
    // console.log("视频源数据加载完成")
    })
    instance.on("waiting", function(){
        // console.log("等待数据")
    });
    instance.on("play", function(){
    // console.log("视频开始播放")
    });
    instance.on("playing", function(){
        // console.log("视频播放中")
    });
    instance.on("pause", function(){
        console.log("视频暂停播放")
    });
    instance.on("ended", function(){
        // console.log("视频播放结束");
    });
    instance.on("error", function(){
        // console.log("加载错误")
    });
    instance.on("seeking",function(){
        // console.log("视频跳转中");
    })
    instance.on("seeked",function(){
        // console.log("视频跳转结束");
    })
    instance.on("ratechange", function(){
        // console.log("播放速率改变")
    });
    instance.on("timeupdate",function(){
        // console.log("播放时长改变");
    })
    instance.on("volumechange",function(){
        // console.log("音量改变");
    })
    instance.on("stalled",function(){
        // console.log("网速异常");
    })
  }, [])

  //播放器初始化
  const initVideoInstance = async () => {
    const instance = Videojs('video', {
      autoplay: false,
      controls: true,
      loop: false,
      muted: false,
      poster: 'https://img-home.csdnimg.cn/images/20201124032511.png',
      language: 'zh-CN',
      // children: [
      //   'bigPlayButton',
      //   'controlBar'
      // ],
      ...props
    })
    setInstance(instance)
    eventBinding(instance)
    reload()
  }

  const mediaInfo = useCallback(async (src: string) => {
    const paths = src?.split('/') || []
    let fileId = paths[paths.length - 1]
    if(!fileId) return 'video/mp4'
    fileId = fileId.includes('.') ? fileId.split('.')[0] : fileId
    let params: API_UPLOAD.IGetMediaListParams = {
      type: 1
    }
    if(isObjectId(fileId)) {
      params._id = fileId
    }else {
      params.content = fileId
    }
    const data = await getMediaList(params)
    const [ target ] = data?.list || []
    return target?.info?.mime?.toLowerCase()
  }, [])

  const pause = useCallback(() => {
    if(!instance) return 
    instance.currentTime(0)
    instance.pause()
  }, [instance])

  const setSrc = useCallback(async () => {
    if(!instance) return 
    const nowSrc = instance.src()
    if(nowSrc === props.src) {
      if(instance.paused()) {
        instance.play()
      }
      return 
    } 
    if(!props.src) {
      pause()
      return 
    }
    const type = await mediaInfo(props.src)
    instance.pause()
    const src: Videojs.Tech.SourceObject = {
      src: props.src,
      type: type || 'video/mp4'
    }
    instance.src(src)
    instance.play()
  // eslint-disable-next-line
  }, [props.src, instance, mediaInfo])

  //重载
  const reload = useCallback(async () => {
    if(!instance) return 
    await setSrc()
  }, [instance, setSrc])

  useEffect(() => {
    if(!instance) initVideoInstance()
    return () => {
      instance?.pause()
      instance?.dispose()
    }
  // eslint-disable-next-line
  }, [instance])

  useEffect(() => {
    if(!instance) return 
    reload()
  }, [setSrc, instance, props.src, reload])

  return (
    <video
      style={{
        width: "100%",
        height: "100%"
      }}
      className="video-js vjs-big-play-centered"
      id="video"
    >
    </video>
  )

})

export default memo(Video)