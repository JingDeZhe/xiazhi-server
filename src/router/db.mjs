import Router from 'koa-router'
import { router as testRouter } from './db/test.mjs'
import { router as doubanRouter } from './db/douban.mjs'

export const router = new Router()

router.use('/test', testRouter.routes()).use(testRouter.allowedMethods())
router.use('/douban', doubanRouter.routes()).use(doubanRouter.allowedMethods())
