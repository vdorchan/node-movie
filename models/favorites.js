const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
  nickname: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  favorites: Array
})

userSchema.pre('save', async function (done) {
  this.favorites = this.favorites || []

  try {
    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(this.password, salt)
    this.password = hash

  } catch (err) {
    done(err)  
  }
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  console.log('comparePassword', candidatePassword, this.password, await bcrypt.compare(candidatePassword, this.password));
  return await bcrypt.compare(candidatePassword, this.password)
}

userSchema.statics.findUserByname = async function (nickname) {
  return await this.findOne({
    nickname
  })
}

userSchema.statics.matchUser = async function (nickname, password) {
  console.log('matchUser', nickname, password);
  if (!nickname || !password) throw new Error('用户名或密码不正确!')

  const user = await this.findUserByname(nickname)
  console.log(user);
  if (!user) throw new Error('找不到该用户！')

  if (await user.comparePassword(password)) {
    return user
  }

  throw new new Error('密码不匹配！')
}

// userSchema.methods.speak = function() {
//   var greeting = this.name ?
//     "Meow name is " + this.name :
//     "I don't have a name"

//   console.log(greeting)
// }

module.exports = mongoose.model('User', userSchema)
