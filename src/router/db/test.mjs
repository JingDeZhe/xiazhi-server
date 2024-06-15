import Router from 'koa-router'
import { testDb } from '../../db/test.mjs'

export const router = new Router()

router.get('/get-all-films', async (ctx) => {
  const d = testDb.getAllFilms()
  ctx.body = d
})
