import Koa from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import { router } from './router/index.mjs'

const app = new Koa()
app.use(cors())
app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods())

app.listen(5177, () => {
  console.log('listening: http://localhost:5177')
})
