import knex from 'knex'
import { fileURLToPath, URL } from 'node:url'

const rv = (p) => fileURLToPath(new URL(p, import.meta.url))

export const db = knex({
  client: 'better-sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: rv('./douban.db'),
  },
})

async function init() {
  await db.schema.hasTable('films').then((t) => {
    if (t) return
    return db.schema.createTable('films', function (table) {
      table.string('id').primary()
      table.string('title').notNullable()
      table.string('original_title')
      table.boolean('is_tv')
      table.string('year')
      table.string('poster')
      table.string('role_desc')
    })
  })

  await db.schema.hasTable('film_ratings').then((t) => {
    if (t) return
    return db.schema.createTable('film_ratings', function (table) {
      table.increments('id').primary()
      table.string('film_id').unique().references('id').inTable('films').onDelete('CASCADE')
      table.integer('count')
      table.integer('max')
      table.float('average')
      table.integer('star_count')
    })
  })
}

init()
