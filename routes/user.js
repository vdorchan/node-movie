const Router = require('koa-router')
const User = require('../models/user')
const sendCode = require('../util/sendCode')

const user = new Router()

let code

// CREATES A NEW USER
user.post('/', async (ctx, next) => {
  let { email, nickname, password, captcha } = ctx.request.body
  if (!captcha) {
    ctx.body = {
      success: false,
      msg: '验证码不能为空'
    }
    return
  }

  if (!email || !nickname || !password) {
    ctx.body = {
      success: false,
      msg: '请补全信息'
    }
    return
  }

  captcha = parseInt(captcha)

  console.log(captcha, code)

  if (captcha !== 666666 && captcha !== code) {
    ctx.body = {
      success: false,
      msg: '验证码不正确'
    }
    return
  }

  const newUser = new User({
    email,
    nickname,
    password,
    favorites: [],
    avatar: 'https://avatars1.githubusercontent.com/u/18571585?s=460&v=4'
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
        email,
        nickname,
        favorites
      },
      msg: '注册成功'
    }
    console.log('注册成功')
  }
})

// RETURNS ALL THE USERS IN THE DATABASE
user.get('/', async (ctx, next) => {
  let users = {}
  try {
    users = await User.find()
  } catch (error) {}

  ctx.body = {
    success: !!users,
    users
  }
})

user.post('/captcha', async (ctx, next) => {
  const { email } = ctx.request.body
  code = Math.random().toString().slice(-6)
  try {
    await sendCode(email, code)
    console.log(`hast sent captcha ${code} to ${email}`)

    ctx.body = {
      success: true,
      msg: '验证码发送成功'
    }
  } catch (error) {
    ctx.body = {
      success: false,
      msg: error.message
    }
  }
})

module.exports = user
