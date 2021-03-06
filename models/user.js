const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  favorites: Array,
  avatar: {
    type: String,
    required: true
  }
})

userSchema.pre('save', async function(done) {
  this.favorites = this.favorites || []

  try {
    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(this.password, salt)
    this.password = hash
  } catch (err) {
    done(err)
  }
})

userSchema.methods.comparePassword = async function(candidatePassword) {
  console.log('comparePassword', candidatePassword, this.password, await bcrypt.compare(candidatePassword, this.password))
  return await bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.addToFavorites = async function(movie) {
  this.favorites.push(movie)
  // console.log(999, this.favorites);
  try {
    await this.save()
    return this.favorites
  } catch (err) {
    console.log(err)
  }
}

userSchema.methods.removeFromFavorites = async function(movieId) {
  this.favorites = this.favorites.filter(({ id }) => movieId !== id)
  try {
    await this.save()
    return this.favorites
  } catch (err) {
    console.log(err)
  }
}

userSchema.methods.getUserInfo = function() {
  const { email, nickname, favorites, avatar } = this

  return {
    email,
    nickname,
    favorites,
    avatar
  }
}

userSchema.statics.findUserByname = async function(nickname) {
  if (!nickname) throw new Error('缺少用户名参数！')
  return await this.findOne({ nickname })
}

userSchema.statics.matchUser = async function(nickname, password) {
  if (!nickname || !password) throw new Error('用户名或密码不正确!')

  const user = await this.findUserByname(nickname)
  if (!user) throw new Error('找不到该用户！')

  if (await user.comparePassword(password)) {
    console.log(88)
    return user
  }
  console.log(1221)

  throw new Error('密码不匹配！')
}

userSchema.statics.findUserById = async function(id) {
  return await this.findById(id)
}

module.exports = mongoose.model('User', userSchema)
