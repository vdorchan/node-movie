const Router = require('koa-router')
const User = require('../models/user')

const user = new Router()

user.post('/', async (ctx, next) => {  
  const {
    nickname,
    password
  } = ctx.request.body

  // console.log('register', 'nickname:', nickname, 'password', password);

  const newUser = new User({
    nickname,
    password,
    favorites: [],
    avatar: '//dummyimage.com/130x130'
  })

  const user = await User.findUserByname(nickname)

  if (user) {
    ctx.body = {
      success: false,
      msg: '用户名重复了'
    }
    return console.log('用户名重复了')
  }

  if (await newUser.save()) {
    const { favorites } = newUser
    ctx.body = {
      success: true,
      userInfo: {
        nickname,
        favorites
      },
      msg: '注册成功'
    }
    console.log('注册成功')
  }
})

user.get('/', async (ctx, next) => {

  // try {
  //   const {nickname, favorites} =  User.findUserByname(ctx.session.nickname)

  //   ctx.body = {
  //     success: true,
  //     userInfo: {
  //       nickname,
  //       favorites
  //     },
  //     msg: '登录成功'
  //   }
  // } catch ({message}) {
  //   ctx.body = {
  //     success: false,
  //     userInfo: null,
  //     msg: message
  //   }
  // }

})

module.exports = user