import React from 'react'
import { Switch, Route, Redirect, Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import Container from './pages/Container'
import Title from './pages/Title'
import Content, { SecurityContainer } from './pages/Content'
import Login from './pages/Login'
import HomePage from './pages/IndexPage'
import Setting from './pages/Setting'
import Chat from './pages/Chat'
import Register from './pages/Register'
import NotFound from './pages/404'
import Footer from './pages/Footer'
import Forget from './pages/Forget'
import store from './store'
import { history } from './utils'
import './App.css'

const App = () => {

  return (
    <Provider store={store}>
      {/* <BrowserRouter> */}
      <Router history={history}>
        <Container>
          <Title />
          <Content>
            <Switch>
              <Route 
                path="/register" 
                component={Register}
              />
              <Route 
                path="/forget" 
                component={Forget}
              />
              <Route path="/*">
                <SecurityContainer>
                  <Switch>
                    <Redirect 
                      path="/"
                      exact
                      from="/"
                      to="/home"
                    />
                    <Route 
                      path="/home"
                      exact
                      component={HomePage}
                    />
                    <Route 
                      path="/setting"
                      exact
                      component={Setting}
                    />
                    <Route 
                      path="/login" 
                      component={Login}
                    />
                    <Route 
                      path="/main" 
                      component={Chat}
                    />
                    <Route 
                      path="/404" 
                      component={NotFound}
                    />
                    <Redirect from="/*" to="/404" />
                  </Switch>
                </SecurityContainer>
              </Route>
            </Switch>
          </Content>
          <Footer />
        </Container>
      {/* </BrowserRouter> */}
      </Router>
    </Provider>
  )
}

export default App