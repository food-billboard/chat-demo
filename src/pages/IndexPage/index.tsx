import React, { memo, useCallback, useEffect } from 'react'
import { Typography } from 'antd'
import { connect } from 'react-redux'
import { history } from '@/utils'
import Canvas from './components/Cnavas'
import { mapStateToProps, mapDispatchToProps } from './connect'
import style from './index.less'

const { Title, Paragraph, Text } = Typography

const FONT_COLOR = {
  color: 'white'
}

export default connect(mapStateToProps, mapDispatchToProps)(
  memo((props: any) => {

    const fetchData = useCallback(() => {
      return props.getUserInfo()
    }, [props])

    const goRoom = useCallback(() => {
      history.push('/main')
    }, [])

    useEffect(() => {
      fetchData()
    }, [fetchData])
  
    return (
      <div className={style["homepage"]}>
        <Canvas />
        <Typography
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center'
          }}
        >
          <Title style={FONT_COLOR}>介绍</Title>
          <Paragraph style={FONT_COLOR}>
            这是一个可以与他人进行线上聊天的项目，包含了一个聊天系统需要的大部分功能。
          </Paragraph>
          <Paragraph style={FONT_COLOR}>
            其中包含的功能有：基础的聊天，好友的添加、删除、黑名单、以及最近联系人、还有多人聊天室
          </Paragraph>
          <Title style={FONT_COLOR} level={2}>设计资源</Title>
          <Paragraph style={FONT_COLOR}>
            如果对源码感兴趣，可以去Github上参考（<a href="https://github.com/food-billboard/chat-demo" rel="noreferrer" target="_blank">这里</a>）
          </Paragraph>
          <Paragraph style={FONT_COLOR}>
            如果到这里你依旧感兴趣，那就进入聊天室感受一下吧<Text style={{cursor: 'pointer', fontSize: 20}} onClick={goRoom} mark underline strong>主页</Text>
          </Paragraph>
        </Typography>
      </div>
    )
  
  })
)