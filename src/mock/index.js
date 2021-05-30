
const express = require('express')
const app = express()

// Mock数据
var mock = require('./config')
var mockList = mock.mockList

mockList.forEach(function(m) {
  app[m.type](m.url, mock[m.name])
})

app.listen('3737', function () {
  
})