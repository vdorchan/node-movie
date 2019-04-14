// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs ')
// const config = require('../ config')
// const User = require('./user')


// try {
//   const { nickname, password } = ctx.request.body
//   const { favorites } =  await User.matchUser(nickname, password)

//   ctx.body = {
//     success: true,
//     userInfo: {
//       nickname,
//       favorites
//     },
//     msg: '登录成功'
//   }

//   var token = jwt.sign({ id: user._id }, config.secret, {
//     expiresIn: 86400 // expires in 24 hours
//   })

//   // ctx.session.nickname = nickname
// } catch ({message}) {
//   ctx.body = {
//     success: false,
//     userInfo: null,
//     msg: message
//   }
// }