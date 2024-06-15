import Router from 'koa-router'
import { db } from '../../db/douban.mjs'

export const router = new Router()

router.get('/get-all-films', async (ctx) => {
  const d = await db.select('*').from('films')
  ctx.body = d
})
