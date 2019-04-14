const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const config = require('../config')

module.exports = async function (ctx, next) {
  const token = ctx.headers['authorization']

  if (!token) {
    return ctx.throw(403, { auth: false, message: 'No token provided.' })
  }
  ctx.decoded = await promisify(jwt.verify)(token, config.secret)
 
  return next()
}