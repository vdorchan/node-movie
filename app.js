const Koa = require('koa')
const Router = require('koa-router')
const bodyPaser = require('koa-bodyparser')
const cors = require('koa-cors')
const session = require('koa-session')

const app = new Koa()
const router = new Router()
const { movie } = require('./routes/douban')

const user = require('./routes/user')
const favorites = require('./routes/favorites')
const _session = require('./routes/session')
const auth = require('./routes/auth')

app.keys = ['some secret hurr']

const db = require('./db')

router.use('/auth', auth.routes(), auth.allowedMethods())
router.use('/movie', movie.routes(), movie.allowedMethods())
router.use('/user', user.routes(), user.allowedMethods())
router.use('/favorites', favorites.routes(), favorites.allowedMethods())

db.connection.on('error', err => {
  console.log('数据库连接失败', err)
})

db.connection.on('open', async () => {
  console.log('数据库连接成功')
  app
    .use(
      cors({
        credentials: true
      })
    )
    .use(bodyPaser())
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(8080, () => {
      console.log('server listening on port 8080')
    })
})
