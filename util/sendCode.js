const { MAILGUN_API_KEY, MAILGUN_DOMAIN } = require('../Env')
const mailgun = require('mailgun-js')({ apiKey: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN })


module.exports = (to, code) => {
  return new Promise((resolve, reject) => {
    const data = {
      from: 'Support Vmovie <support@mail.vdorchan.com>',
      to,
      subject: `vMovie 的验证码是 ${code}`,
      text: `vMovie 的验证码是 ${code}`
    }
    mailgun.messages().send(data, (error, body) => {
      console.log(body)
      error ? reject(error) : resolve(body)
    })
  })
}
