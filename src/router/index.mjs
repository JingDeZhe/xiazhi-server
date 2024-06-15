import Router from 'koa-router'
import { router as aiRouter } from './ai.mjs'
import { router as dbRouter } from './db.mjs'

export const router = new Router()

router.use('/ai', aiRouter.routes()).use(aiRouter.allowedMethods())
router.use('/db', dbRouter.routes()).use(dbRouter.allowedMethods())
