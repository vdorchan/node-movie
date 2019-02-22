const Router = require('koa-router')
const User = require('../models/user')

const favorites = new Router()

favorites.post('/', async (ctx, next) => {
  const {
    movie
  } = ctx.request.body

  if (!movie) {
    ctx.body = {
      success: false,
      movie: null,
      msg: '请传入要收藏的电影！'
    }
  }

  try {
    const theUser = await User.findUserByname(ctx.session.nickname) 
    const favorites = await theUser.addToFavorites(movie)

    ctx.body = {
      success: true,
      favorites,
      msg: '收藏成功'
    }
  } catch ({message}) {
    ctx.body = {
      success: false,
      userInfo: null,
      msg: message
    }
  }
})

favorites.delete('/', async (ctx, next) => {
  const {
    movieId
  } = ctx.query

  if (!movieId) {
    ctx.body = {
      success: false,
      msg: '请传入要删除收藏的电影！'
    }
    return 
  }

  try {
    const theUser = await User.findUserByname(ctx.session.nickname) 
    const favorites = await theUser.removeFromFavorites(movieId)

    ctx.body = {
      success: true,
      favorites,
      msg: '删除收藏成功'
    }
  } catch ({message}) {
    ctx.body = {
      success: false,
      msg: message
    }
  }
})

module.exports = favorites