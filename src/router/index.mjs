import Router from 'koa-router'
import { router as aiRouter } from './ai.mjs'

export const router = new Router()

router.use('/ai', aiRouter.routes()).use(aiRouter.allowedMethods())
