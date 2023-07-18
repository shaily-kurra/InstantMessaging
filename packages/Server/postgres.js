const { Pool } = require("pg");

const pool = new Pool({
    user: 'admin',
    database: 'users',
    host: '34.71.219.206',
    password: 'chatapp',
    port: '5432',
})
  
  const getUserById = (request) => {
    return new Promise(function(resolve, reject) {
        const id = request.query.uname
        pool.query('SELECT * FROM user_info WHERE username = $1', [id], (error, results) => {
            if(error){
                reject(error)
            }
            else{
                resolve(results)
            }
        })
    })
  }

  const getUserByIdName = (request) => {
    return new Promise(function(resolve, reject) {
        const name = request.query.fullname
        const id = request.query.uname
        pool.query('SELECT * FROM user_info WHERE username = $1 and display_name = $2', [id,name], (error, results) => {
        if(error){
            reject(error)
        }
        else{
            resolve(results)
        }
    })
  })
}

  const createUser = (request) => {
    return new Promise(function(resolve, reject) {
    const fullname = request.fullname
    const uname = request.uname
    const password = request.password
  
    pool.query('INSERT INTO user_info (display_name, username, password) VALUES ($1, $2, $3) RETURNING *', [fullname, uname, password], (error, results) => {
      if(error){   
        reject(error)
      }
      resolve('Successfully inserted');
    })
  })
}
  
  module.exports = {
    getUserById,
    getUserByIdName,
    createUser
  }