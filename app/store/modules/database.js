const Sqlite = require('nativescript-sqlite')

const state = {
  database: null
}

const getters = {
  database: state => state.database
}

const mutations = {
  init (state, database) {
    state.database = database
  }
}

const actions = {
  initDatabase (context) {
    return new Promise((resolve, reject) => {
      (new Sqlite('hemayat.db')).then(db => {
        db.resultType(Sqlite.RESULTSASOBJECT)
        context.commit('init', db)

        db.get('SELECT name FROM sqlite_master WHERE type="table" AND name="user_data";', []).then(row => {
          // console.log('row in db: ' + row)
          if (!row) {
            db.execSQL('CREATE TABLE user_data (id INTEGER PRIMARY KEY AUTOINCREMENT, user_token TEXT);').then(() => {
              db.execSQL("INSERT INTO user_data (user_token) VALUES (NULL);").then(() => {
                console.log('Database init success')
                resolve()
              }, error => {
                console.log('initial insert error', error)
                reject(error)
              })
            }, error => {
              console.log('CREATE TABLE ERROR', error)
              reject(error)
            })
          } else {
            db.get('select * from user_data', []).then(row => {
              // console.log('row in db: ' + JSON.stringify(row))
              if (row) {
                context.commit('updateUserToken', row.user_token)
              }
              resolve()
            }, error => {
              console.log('SELECT ERROR ', error)
              reject(error)
            })
          }
        }, error => {
          console.log('SELECT ERROR ', error)
          reject(error)
        })
      }, error => {
        console.log('OPEN DB ERROR', error)
        reject(error)
      })
    })
  }
}

// export this module.
export default {
  state,
  mutations,
  getters,
  actions
}
