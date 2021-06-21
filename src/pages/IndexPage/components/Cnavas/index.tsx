import React, { memo, useCallback, useEffect } from 'react'
import classnames from 'classnames'
import styles from './index.less'
import { useState } from 'react'

function retNumForArea(maxNum: number, minNum: number) {                          //生成在一个范围内的随机数;
  var x = Math.floor(Math.random() * (maxNum - minNum + 1) + minNum)
  return x
}

class Bubble {

  constructor(context: CanvasRenderingContext2D, options: Partial<{
    wrapperWidth: number
    wrapperHeight: number
    down?: boolean
  }>={}) {
    this.context = context
    this.wrapperWidth = options.wrapperWidth || 0
    this.wrapperHeight = options.wrapperHeight || 0
    this.down = !!options.down
  }

  x: number = 0
  y: number = 0
  w: number = 2
  h: number = 10
  color: string = '#3ff'
  speed: number = 0
  height: number = 0
  mark: number = 0
  r: number = 2
  maxR: number = 0
  wrapperWidth: number = 0
  wrapperHeight: number = 0
  context: CanvasRenderingContext2D
  down: boolean = false 


  init = () => {         //生成小雨滴;
    this.x = retNumForArea(this.wrapperWidth, 0)
    if(this.down) {
      this.y = retNumForArea(this.wrapperHeight / 5, 0)
    }else {
      this.y = retNumForArea(this.wrapperHeight / 5 * 4, 0)
    }
    this.speed = retNumForArea(2, 3)
    this.height = retNumForArea(0.9 * this.wrapperHeight, 0.8 * this.wrapperHeight)
    this.mark = retNumForArea(1, 0)
    this.maxR = retNumForArea(80, 130)
  }

  move = () => {
    if(this.down) {
      this.moveDown()
    }else {
      this.moveUp()
    }
  }

  moveUp = () => {
    if (this.y > 0) {
      this.y -= this.speed;
    } else {
      this.r++
      if (this.r > this.maxR) {
        this.init()
      }
    }
    this.draw()
  }

   //移动;
  moveDown = () => {    
    if (this.y < this.height) {
      this.y += this.speed;
    } else {
      this.r++
      if (this.r > this.maxR) {
        this.init()
      }
    }
    this.draw()
  }

  drawDown = () => {
    if(this.y < this.height) {
      this.context.fillStyle = this.color;
      this.context.fillRect(this.x, this.y, this.w, this.h);
    }else {
      this.context.beginPath();
      // this.context.strokeStyle = this.color;
      // this.context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      // this.context.stroke();
    }
  }

  drawUp = () => {
    if(this.y > 0) {
      this.context.fillStyle = this.color;
      this.context.fillRect(this.x, this.y, this.w, this.h);
    }else {

    }
  }

  //画出雨滴;
  draw = () => {        
    if(this.down) {
      this.drawDown()
    }else {
      this.drawUp()
    }
  }

}

export default memo(() => {

  const [ bubbleList, setBubbleList ] = useState<Bubble[]>([])
  let timer: NodeJS.Timeout 

  const init = useCallback((initList:boolean=true) => {
    const oCanvas: HTMLCanvasElement | null = document.querySelector('.index-canvas')
    if(!!oCanvas) {
      const context = oCanvas.getContext('2d')
      //canvas的可视区域获取;
      const clientHeight =  oCanvas.clientHeight 
      const clientWidth = oCanvas.clientWidth  //窗口大小
      initList && setBubbleList([])
      const createBubble = (num: number, time: number) => { 
        if(!context) return   
        for (var i = 0; i < num; i++) {
            setTimeout(() => {
                var bubble = new Bubble(context, {
                  wrapperWidth: clientWidth,
                  wrapperHeight: clientHeight
                })
                bubble.init()
                bubble.draw()
                bubbleList.push(bubble)
            }, time * i);
        }
      }
      const render = () => {
        if(context) {
          context.fillStyle = 'rgba(0,0,0,0.1)';
          context.fillRect(0, 0, clientWidth, clientHeight)
          for (var item of bubbleList) {
            item.move()
          }
        }
      }
      createBubble(100, 500)
      timer = setInterval(render, 1000 / 60)
    }
  }, [bubbleList])

  useEffect(() => {
    init()
    const resizeInit = () => {
      clearInterval(timer)
      init(false) 
    }
    window.addEventListener('resize', resizeInit)
    return () => {
      window.removeEventListener('resize', resizeInit)
    }
  }, [])

  return (
    <canvas className={classnames(styles["index-canvas"], 'index-canvas')}>
      浏览器不支持canvas画布
    </canvas>
  )

})