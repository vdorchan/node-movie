const Router = require('koa-router')
const cheerio = require('cheerio')

const { httpsGet, updateQueryStringParameter } = require('../util')

const apiKey = require('../apiKey') // apiKey 从豆瓣申请，可以增加单位时间内允许请求数，以及更多的可访问数据

const appendApiKey = url => updateQueryStringParameter(url, 'apiKey', apiKey)

const requestDouban = async url => {
  const body = await httpsGet(appendApiKey(`https://api.douban.com/v2/movie${url.replace('/movie', '')}`))
  return body.replace(/doubanio.com/g, 'vdorchan.com')
}

const movie = new Router()

const getRecommand = async id => {
  const chunks = await httpsGet(`https://movie.douban.com/subject/${id}/`)
  return new Promise((resolve, reject) => {
    let json = []
    const $ = cheerio.load(chunks, { decodeEntities: false })

    $('#recommendations')
      .find('dl')
      .each((idx, elem) => {
        var $a = $(elem).find('dd a')
        json.push({
          poster: $(elem)
            .find('img')
            .attr('src')
            .replace('.doubanio.com', '.vdorchan.com'),
          name: $a.html(),
          id: $a.attr('href').replace(/\S+\/subject\/(\d+)\S+/, '$1')
        })
      })

    return resolve(json)
  })
}

const getBigPoster = async id => {
  const chunks = await httpsGet(`https://movie.douban.com/subject/${id}/photos?type=R`)
  let $ = cheerio.load(chunks, { decodeEntities: false })

  return new Promise((resolve, reject) => {
    const poster = $('#content')
      .find('.cover')
      .eq(0)
      .find('img')
      .attr('src')
      .replace('.doubanio.com', '.vdorchan.com')

    resolve(poster)
  })
}

/**
 * type: top250, us_box, weekly, new_movies, in_theaters, coming_soon, weekly
 */
movie.get('/:type', async (ctx, next) => {
  ctx.body = await requestDouban(ctx.url)
})

movie.get('/subject/:id', async (ctx, next) => {
  ctx.body = Object.assign(JSON.parse(await requestDouban(ctx.url)), {
    bigPoster: await getBigPoster(ctx.params.id)
  })
})

/**
 * type: photos, reviews, comments, works
 */
movie.get('/subject/:id/:type', async (ctx, next) => {
  const { type } = ctx.params
  if (type === 'recommands') {
    ctx.body = { subjects: await getRecommand(ctx.params.id) }
  } else if (type === 'bigPoster') {
    ctx.body = { bigPoster: await getBigPoster(ctx.params.id) }
  } else {
    ctx.body = await requestDouban(ctx.url)
  }
})

movie.get('/celebrity/:id/:type', async (ctx, next) => (ctx.body = await requestDouban(`/celebrity/${ctx.params.id}/${ctx.params.type}`)))

movie.get('/search', async (ctx, next) => (ctx.body = await requestDouban(`/${ctx.url}`)))

exports.movie = movie
