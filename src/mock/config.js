var fs = require('fs')

var mockList = [
   {
     name: 'home',
     type: 'post',
     url: '/home',
     res: {}
   }
   // 第二个接口... 第三个接口
]
 
 // 输出配置项
module.exports.mockList = mockList
 
// 遍历输出json数据
for (let i = 0, len = mockList.length; i < len; i++) {
  var name = mockList[i].name

  module.exports[name] = function(_, res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.json(JSON.parse(mockList[i].res))
  }
}