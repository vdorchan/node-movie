const Router = require('koa-router')
const cheerio = require('cheerio')

const {
  httpsGet,
  updateQueryStringParameter,
} = require('../util')

const apiKey = require('../apiKey') // apiKey 从豆瓣申请，可以增加单位时间内允许请求数，以及更多的可访问数据

const appendApiKey = url => updateQueryStringParameter(url, 'apiKey', apiKey)

const requestDouban = url => httpsGet(appendApiKey(`https://api.douban.com/v2/movie${url}`))

const movie = new Router()

const getRecommand = async (id) => {
  const chunks = await httpsGet(`https://movie.douban.com/subject/${id}/`)
  return new Promise((resolve, reject) => {
    let json = []
    const $ = cheerio.load(chunks, {decodeEntities:false})
        
    $('#recommendations').find('dl').each((idx, elem) => {
      var $a = $(elem).find('dd a')
      json.push({
        poster: $(elem).find('img').attr('src').replace('.doubanio.com', '.vdorchan.com'),
        name: $a.html(),
        id: $a.attr('href').replace(/\S+\/subject\/(\d+)\S+/, '$1')
      })
    })

    return resolve(json)
  })
}

const getBigPoster = async (id) => {
  const chunks = await httpsGet(`https://movie.douban.com/subject/${id}/photos?type=R`)
  let $ = cheerio.load(chunks, {decodeEntities:false})

  // const href = $('#content').find('.cover a').attr('href')
  // const _chunks = await httpsGet(href)

  // $ = cheerio.load(_chunks, {decodeEntities:false})

  return new Promise((resolve, reject) => {
    // const poster = $('.mainphoto img').attr('src').replace('jgp', 'webp')
    const poster = $('#content').find('.cover').eq(0).find('img').attr('src')

    return resolve(poster)
  })
}

movie.get('/:type', async (ctx, next) => ctx.body = (await requestDouban(`/${ctx.params.type}`)).replace(/doubanio.com/g, 'vdorchan.com'))
movie.get('/subject/:id', async (ctx, next) => ctx.body = Object.assign(JSON.parse(await requestDouban(`/subject/${ctx.params.id}`)), { bigPoster: await getBigPoster(ctx.params.id) }))
// movie.get('/subject/:id/photos', async (ctx, next) => ctx.body = await httpsGet(appendApiKey(`https://api.douban.com/v2/subject${ctx.url}`)))
// movie.get('/subject/:id/reviews', async (ctx, next) => ctx.body = await httpsGet(appendApiKey(`https://api.douban.com/v2/subject${ctx.url}`)))
// movie.get('/subject/:id/comments', async (ctx, next) => ctx.body = await httpsGet(appendApiKey(`https://api.douban.com/v2/subject${ctx.url}`)))

movie.get('/subject/:id/recommands', async (ctx, next) => ctx.body = { subjects: await getRecommand(ctx.params.id) })
movie.get('/subject/:id/bigPoster', async (ctx, next) => ctx.body = { bigPoster: await getBigPoster(ctx.params.id) })
movie.get('/subject/:id/:type', async (ctx, next) => ctx.body = await requestDouban(`/subject/${ctx.params.id}/${ctx.params.type}`))

movie.get('/celebrity/:id/:type', async (ctx, next) => ctx.body = await requestDouban(`/celebrity/${ctx.params.id}/${ctx.params.type}`))
// movie.get('/celebrity/:id/works', async (ctx, next) => ctx.body = await httpsGet(appendApiKey(`https://api.douban.com/v2${ctx.url}`)))
// movie.get('/celebrity/:id/photos', async (ctx, next) => ctx.body = await httpsGet(appendApiKey(`https://api.douban.com/v2${ctx.url}`)))

movie.get('/search', async (ctx, next) => ctx.body = await requestDouban(`/${ctx.url}`))

// movie.get('/top250', async (ctx, next) => ctx.body = await requestDouban('/top250'))
// movie.get('/us_box', async (ctx, next) => ctx.body = await requestDouban('/us_box'))
// movie.get('/weekly', async (ctx, next) => ctx.body = await requestDouban('/weekly'))
// movie.get('/new_movies', async (ctx, next) => ctx.body = await requestDouban('/new_movies'))
// movie.get('/in_theaters', async (ctx, next) => ctx.body = await requestDouban('/in_theaters'))
// movie.get('/coming_soon', async (ctx, next) => ctx.body = await requestDouban('/coming_soon'))
// movie.get('/weekly', async (ctx, next) => ctx.body = await requestDouban('/weekly'))

exports.movie = movie
