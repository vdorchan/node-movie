const Router = require('koa-router')
const Auth = require('../models/auth')
const config = require('../config')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')

const User = require('../models/user')
const verifyToken = require('../util/verifyToken')

const auth = new Router()

auth.post('/login', async (ctx, next) => {
  const { nickname, password } = ctx.request.body

  try {
    const user = await User.matchUser(nickname, password)

    const token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    })

    ctx.body = {
      success: true,
      userInfo: user.getUserInfo(),
      msg: '登录成功',
      auth: true,
      token
    }
  } catch ({ message }) {
    ctx.body = {
      success: false,
      userInfo: null,
      msg: message
    }
  }
})

auth.get('/profile', verifyToken, async (ctx, next) => {
  try {
    const { decoded } = ctx

    const user = await User.findById(decoded.id)

    if (!user) throw new Error('')

    ctx.body = {
      user: user.getUserInfo(),
      success: true
    }
  } catch (error) {
    ctx.body = {
      success: false,
      message: 'UnAuthorized'
    }
    // return ctx.throw(401, 'UnAuthorized')
  }
})

auth.post('/logout', function() {})

module.exports = auth
