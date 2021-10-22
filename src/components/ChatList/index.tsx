import React, { Component } from 'react'
import { message } from 'antd'
import { connect } from 'react-redux'
import { merge, uniqueId } from 'lodash-es'
import { PageHeaderProps } from 'antd/es/page-header'
import scrollIntoView from 'scroll-into-view-if-needed'
import Day from 'dayjs'
import { IProps, TMessageValue } from './components/ChatData'
import ChatList from './components/ChatList'
import ChatHeader from '../UserHeader'
import ChatInput from '../ChatInput'
import ObserverDom from './components/Intersection'
import BackToBottom from './components/BackToBottom'
import { postMessage, bindActionStorage, unBindActionStorage } from '@/utils/socket'
import { getMessageDetail } from '@/services'
import { mapStateToProps, mapDispatchToProps } from './connect'
import { withTry, sleep } from '@/utils'

export interface IGroupProps extends Omit<IProps, "value">{
  header: Partial<PageHeaderProps>
  currentRoom?: API_CHAT.IGetRoomListData
  socket?: any 
  fetchLoading?: boolean 
  messageListDetailSave?: (value: any, insert: { insertBefore?: boolean, insertAfter?: boolean }) => Promise<void>
  value?: TMessageValue[] 
  userInfo?: STORE_USER.IUserInfo
}

class GroupChat extends Component<IGroupProps> {

  public state: {
    currPage: number 
    bottomNode?: Element
    bottom: boolean,
    hasNewMessage: boolean 
  } = {
    currPage: 0,
    bottomNode: undefined,
    bottom: false,
    hasNewMessage: false 
  }

  first = true 
  private messageGetUuid = ''
  private postMessageGetUuid = ""
  fetchLoading = false 
  quit = false 
  bottomId = uniqueId("intersection-observer-bottom")

  componentDidMount = () => {
    this.postMessageGetUuid = bindActionStorage("post", async (response: any) => {
      const { value } = this.props
      const currentId = response.res?.data
      const target = value?.find(item => item._id === currentId)
      if(target && !this.isMinePost(target)) {
        if(this.state.bottom) {
          this.waitScrollToBottom()
        }else {
          this.setState({
            hasNewMessage: true 
          })
        }
      }
    })
    this.messageGetUuid = bindActionStorage("message", async () => {
      await sleep(2000)
      this.fetchLoading = false 
    })
  }

  componentWillUnmount = () => {
    unBindActionStorage("message", this.messageGetUuid)
    unBindActionStorage("post", this.postMessageGetUuid)
  }

  isMinePost = (message: TMessageValue) => {
    const { userInfo } = this.props
    return userInfo?._id === message.user_info._id 
  }

  getNode = () => {
    const node = document.querySelector(`#${this.bottomId}`)
    if(node) this.setState({
      bottomNode: node
    })
    return node 
  }

  scrollToBottom = () => {
    const { bottomNode } = this.state 
    let node: any = bottomNode
    if(!node) node = this.getNode()
    if(node) scrollIntoView(node, {
      scrollMode: 'if-needed',
      block: 'nearest',
      inline: 'nearest',
      behavior: 'smooth',
    })
  }

  fetchData = async (params: Omit<API_CHAT.IGetMessageDetailParams, "_id">={ currPage: 0, pageSize: 10 }) => {
    const { messageListDetail, currentRoom, socket } = this.props 
    await messageListDetail?.(socket, merge({}, params, { _id: currentRoom?._id }))
  }

  waitScrollToBottom = async (times=500) => {
    await sleep(times)
    this.scrollToBottom()
  }

  getStartDate = () => {
    const { value=[] } = this.props
    const [ first ] = value
    const startTime = first?.createdAt  
    return !!startTime ? Day(startTime).toDate() : false 
  }

  internalFetchData = async(params: Partial<{ currPage: number, pageSize: number, start: string }>={}, toBottom: boolean=false) => {
    if(this.fetchLoading || this.quit) return 
    this.fetchLoading = true 
    const { currPage } = this.state 
    const startTime = this.getStartDate() 
    const newParams = merge({ start: startTime, currPage, pageSize: 10 }, params)
    if(newParams.currPage === currPage && !!startTime) newParams.currPage = 0
    await this.fetchData(newParams)
    this.setState({
      currPage: newParams.currPage + 1
    })
    if(toBottom) {
      await this.waitScrollToBottom()
    }
  }

  onBack = (e: any) => {
    this.quit = true 
    const { header } = this.props 
    header.onBack?.(e)
  }

  handlePostMessage = async (value: any) => {
    const { currentRoom, socket, messageListDetailSave } = this.props 
    let params: API_CHAT.IPostMessageParams = merge({}, value, {
      _id: currentRoom?._id
    })
    const [err, res] = await withTry(postMessage)(socket, params)
    if(err) {
      message.info('消息发送失败')
    }else {
      const newData = await getMessageDetail({
        messageId: res,
        _id: currentRoom!._id
      })
      await messageListDetailSave?.(newData, {
        insertAfter: true 
      })
    }
  }

  onObserver = () => {
    this.internalFetchData({}, this.first)
    if(this.first) this.first = false 
  }

  ChatHeaderDom = () => {
    const { header } = this.props 
    return (
      <ChatHeader 
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'rgb(236, 239, 243)',
          zIndex: 1
        }} 
        title={"用户名"}
        subTitle={""}
        {...header}
        onBack={this.onBack}
      />
    )
  }

  onObserverDomToBottom = (target: IntersectionObserverEntry) => {
    const toBottom = !(target.intersectionRatio === 0)
    let changeState: any = {
      bottom: toBottom,
    }
    if(toBottom) changeState.hasNewMessage = false 
    this.setState(changeState)
  }

  render() {

    const { currentRoom, socket, fetchLoading, messageListDetailSave, messageListDetail, value=[], loading, header, ...nextProps } = this.props
    const { hasNewMessage } = this.state 

    return (
      <div  
        style={{height: '100%', overflow: 'auto'}}
      >
        <div
          style={{
            height: currentRoom?.type === 'SYSTEM' ? "100%" : 'calc(100% - 30vh)',
            overflow: 'auto'
          }}
          id="chat-list-wrapper"
        >
          {this.ChatHeaderDom()}
          <ObserverDom onObserve={this.onObserver} root={"chat-list-wrapper"} />
          <ChatList loading={!!fetchLoading} {...nextProps} value={value} />
          <ObserverDom onObserve={this.onObserverDomToBottom} root={"chat-list-wrapper"} id={this.bottomId} />
        </div>
        <BackToBottom type="icon" onClick={this.scrollToBottom} />
        {
          hasNewMessage && <BackToBottom type="message" onClick={() => {
            this.setState({
              hasNewMessage: false
            }, this.scrollToBottom)
          }} />
        }
        <ChatInput scrollToBottom={this.waitScrollToBottom} style={{height: currentRoom?.type === 'SYSTEM' ? 0 : '30vh', visibility: currentRoom?.type === 'SYSTEM' ? 'hidden' : 'visible' }} onPostMessage={this.handlePostMessage} />
      </div>
    )

  }

}

export default connect(mapStateToProps, mapDispatchToProps)(GroupChat)