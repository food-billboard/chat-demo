import { combineReducers, createStore, applyMiddleware } from "redux"
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import getUserInfo from './UserInfo'
import Login from './Login'
import Register from './Register'
import Forgot from './Forget'

export { fetchUserInfoData, fetchLogout } from './UserInfo/action'
export { fetchLogin, redirectPage } from './Login/action'
export { fetchRegister } from './Register/action'
export { fetchForget } from './Forget/action'

const reducers = combineReducers({
  getUserInfo,
  Login,
  Register,
  Forgot
})

export default createStore(reducers, applyMiddleware(
  thunkMiddleware,
  createLogger()
))

