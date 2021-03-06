import { combineReducers, createStore, applyMiddleware } from "redux"
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import getUserInfo from './UserInfo'
import Login from './Login'
import Register from './Register'
import Forgot from './Forget'
import Socket from './Chat'
import Message from './Message'
import MessageDetail from './MessageDetail'
import Room from './Room'
import InviteFriend from "./InviteList"

export { fetchUserInfoData, fetchLogout } from './UserInfo/action'
export { fetchLogin, redirectPage } from './Login/action'
export { fetchRegister } from './Register/action'
export { fetchForget } from './Forget/action'
export { connect, exchangeRoom } from './Chat/action'
export { messageList, messageListSave } from './Message/action'
export { messageListDetail, messageListDetailSave } from './MessageDetail/action'
export { roomList, roomListSave } from './Room/action'
export { inviteFriendListSave, inviteFriendList } from './InviteList/action'

const reducers = combineReducers({
  getUserInfo,
  Login,
  Register,
  Forgot,
  Socket,
  Message,
  MessageDetail,
  Room,
  InviteFriend
})

const args: any = [
  thunkMiddleware
]

process.env.NODE_ENV === "development" && args.push(createLogger())

export default createStore(reducers, applyMiddleware(...args))

