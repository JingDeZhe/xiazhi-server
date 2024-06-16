import Router from 'koa-router'
import { db } from '../../db/douban.mjs'
import { service } from './doubanService.mjs'

export const router = new Router()

router.post('/get-films', async (ctx) => {
  const pay = ctx.request.body
  const films = await db('films')
    .select('*')
    .limit(pay?.limit || 10)

  const ratings = await db('film_ratings').where((builder) =>
    builder.whereIn(
      'film_id',
      films.map((d) => d.id)
    )
  )

  for (const film of films) {
    film.rating = ratings.find((d) => d.film_id === film.id) || {}
  }

  ctx.body = films
})

router.post('/get-film', async (ctx) => {
  const pay = ctx.request.body
  const film = await db('films').where('id', pay.id).first()

  ctx.body = film
})

router.post('/grid-service', async (ctx) => {
  const params = await service.getData(ctx.request.body)
  ctx.body = params
})
