import { combineReducers, createStore, applyMiddleware } from "redux"
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import getUserInfo from './UserInfo'

export * from './UserInfo/action'

const reducers = combineReducers({
  getUserInfo
})

export default createStore(reducers, applyMiddleware(
  thunkMiddleware,
  createLogger()
))

