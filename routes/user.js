const Router = require('koa-router')
const User = require('../models/user')

const user = new Router()

// CREATES A NEW USER
user.post('/', async (ctx, next) => {
  const { nickname, password } = ctx.request.body

  const newUser = new User({
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
  } catch (error) {
  }

  ctx.body = {
    success: !!users,
    users
  }
})

module.exports = user
