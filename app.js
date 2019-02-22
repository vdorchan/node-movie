const Koa = require('koa');
const Router = require('koa-router')
const bodyPaser = require('koa-bodyparser')
const cors = require('koa-cors')
const session = require('koa-session')

const app = new Koa()
const router = new Router()
const {movie} = require('./routes/douban')

const user = require('./routes/user')
const favorites = require('./routes/favorites')
const _session = require('./routes/session')

const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
}

app.keys = ['some secret hurr']

const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/vue-movie')

mongoose.connection.on('error', err => {
  console.log('数据库连接失败', err);
})

mongoose.connection.on('open', async () => {
  console.log('数据库连接成功')

  router.use('/movie', movie.routes(), movie.allowedMethods())
  router.use('/user', user.routes(), user.allowedMethods())
  router.use('/favorites', favorites.routes(), favorites.allowedMethods())
  router.use('/session', _session.routes(), _session.allowedMethods())
  
  app
    .use(cors({
      credentials: true
    }))
    .use(session(CONFIG, app))
    .use(bodyPaser())
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(8080)
})


