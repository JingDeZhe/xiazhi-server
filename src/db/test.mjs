import Database from 'better-sqlite3'
import { fileURLToPath, URL } from 'node:url'
import { getSqlParams } from './util.mjs'

const rv = (p) => fileURLToPath(new URL(p, import.meta.url))

const testFilm = {
  name: '天书奇谭',
  releaseDate: '1983年',
  genre: '动画/奇幻',
  producer: '上海美术电影制片厂',
  personalRating: 9, // 假设评分更新为9
}

class TestDb {
  constructor() {
    this.db = new Database(rv('./test.db'))
    this.db
      .prepare(
        `
        CREATE TABLE IF NOT EXISTS films (  
          id INTEGER PRIMARY KEY AUTOINCREMENT,  
          name TEXT NOT NULL,  
          releaseDate TEXT,  
          genre TEXT,  
          producer TEXT,  
          personalRating INTEGER  
        ); 
        `
      )
      .run()

    this.insertFilmSql = this.db.prepare(`  
      INSERT INTO films (name, releaseDate, genre, producer, personalRating)
      VALUES (?, ?, ?, ?, ?)  
    `)

    this.updateFilmByNameSql = this.db.prepare(
      `UPDATE films SET releaseDate = ?, genre = ?, producer = ?, personalRating = ? WHERE name = ?`
    )

    this.getAllFilmsSql = this.db.prepare(`
      SELECT * FROM films
    `)

    this.getFilmByNameSql = this.db.prepare('SELECT * FROM films WHERE name = ?')

    this.insertFilm(testFilm)
  }

  existsFilm(name) {
    const film = this.getFileByName(name)
    return !!film
  }

  getFileByName(name) {
    return this.getFilmByNameSql.get(name)
  }
  insertFilm(film) {
    const exists = this.existsFilm(film.name)
    if (!exists) {
      return this.insertFilmSql.run(...getSqlParams(film, 'name, releaseDate, genre, producer, personalRating'))
    } else {
      return this.updateFilmByNameSql.run(...getSqlParams(film, 'releaseDate, genre, producer, personalRating, name'))
    }
  }

  getAllFilms() {
    return this.getAllFilmsSql.all()
  }
}

export const testDb = new TestDb()
