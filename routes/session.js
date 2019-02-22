const Router = require('koa-router')
const User = require('../models/user')

const session = new Router()

/**
 * 获取会话信息
 */
session.get('/', async (ctx, next) => {
  try {
    const nickname = ctx.session.nickname

    if (!nickname) throw new Error('未登录')

    const theUser =  await User.findUserByname(nickname)

    if (!theUser) {
      throw new Error('该用户不存在')
    }

    const { favorites } = theUser

    ctx.body = {
      success: true,
      userInfo: {
        nickname,
        favorites
      },
      msg: '获取会话成功'
    }
  } catch ({message}) {
    ctx.body = {
      success: false,
      userInfo: null,
      msg: message
    }
  }
})

/**
 * 创建新的会话（登入）
 */
session.post('/', async (ctx, next) => {
  try {
    const { nickname, password } = ctx.request.body
    const { favorites } =  await User.matchUser(nickname, password)

    ctx.body = {
      success: true,
      userInfo: {
        nickname,
        favorites
      },
      msg: '登录成功'
    }

    ctx.session.nickname = nickname
  } catch ({message}) {
    ctx.body = {
      success: false,
      userInfo: null,
      msg: message
    }
  }
})

/**
 * 更新会话信息
 */
session.put('/', async (ctx, next) => {})

/**
 * 销毁当前会话（登出）
 */
session.delete('/', (ctx, next) => {
  ctx.session.nickname = null
  ctx.body = {
    success: true,
    msg: '登出成功'
  }
})

module.exports = session