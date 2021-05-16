import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { Provider } from 'react-redux'
import Login from './pages/Login'
import HomePage from './pages/IndexPage'
import Chat from './pages/Chat'
import Register from './pages/Register'
import NotFound from './pages/404'
import store from './store'
import './App.css'

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route 
            path="/login" 
            exact
          >
            <Login />
          </Route>
          <Route 
            path="/register" 
            exact
          >
            <Register />
          </Route>
          <Route 
            path="/main" 
          >
            <Chat />
          </Route>
          <Route path="/404">
            <NotFound />
          </Route>
          <Redirect from="/*" to="/404" />
        </Switch>
      </BrowserRouter>
    </Provider>
  )
}

export default App
