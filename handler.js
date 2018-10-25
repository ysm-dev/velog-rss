'use strict'
const RSS = require('rss')
const axios = require('axios')

const VELOG_WEB = 'https://velog.io/'
const VELOG_API = 'https://api.velog.io/'
const VELOG_POSTS_API = `${VELOG_API}posts/public`

const getFeedOptions = _ => ({
  title: 'velog',
  description: 'velog',
  generator: 'velog',
  // feed_url: `@@@`,
  site_url: VELOG_WEB,
  image_url: 'https://images.velog.io/velog.png'
})

const getItemsWithOptions = async _ => {
  const response = await axios.get(VELOG_POSTS_API)
  return response.data.map(({ title, body, user, url_slug, created_at }) => ({
    title: title,
    description: body,
    url: `${VELOG_WEB}@${user.username}/${url_slug}`,
    date: created_at
  }))
}

const getRSS = async (event, ctx, callback) => {
  const feedOptions = getFeedOptions()
  const items = await getItemsWithOptions()

  const feed = new RSS(feedOptions)
  items.forEach(item => {
    feed.item(item)
  })

  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/xml'
    },
    body: feed.xml({
      indent: true
    })
  }
  callback(null, response)
}

exports.getRSS = getRSS
