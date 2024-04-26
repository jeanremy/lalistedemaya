import { Client } from '@notionhq/client'
import scrap from 'open-graph-scraper'
import { AssetCache } from '@11ty/eleventy-fetch'

const blockId = 'c15419f0d2404110b6a6b2929722c202'

// check if the cache is fresh within the last day
async function getDb() {
  let cachedDb = new AssetCache('notionDb')
  if (cachedDb.isCacheValid('1d')) {
    // return cached data.
    return cachedDb.getCachedValue() // a promise
  }

  const notion = new Client({
    auth: process.env.NOTION_SECRET,
  })

  const result = await notion.databases.query({
    database_id: blockId,
  })

  await cachedDb.save(result, 'json')

  return result
}

async function getImages() {
  let images = new AssetCache('images')
  if (images.isCacheValid('1d')) {
    // return cached data.
    return images.getCachedValue() // a promise
  }

  const response = await getDb()

  const list = await Promise.all(
    response.results.map(async (res) => {
      const { error, result } = await scrap({ url: res.properties.URL.url })
      if (!error) {
        return result
      }
      return null
    })
  )

  await images.save(list, 'json')

  return list
}

export default async function () {
  return getImages()
}
