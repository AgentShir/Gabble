const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const uuid = require('uuid')

router.post("/login", function(req, res, next){
  const username = req.body.username
  const password = req.body.password

  const sql = `
    SELECT password FROM gabblers
    WHERE username = ?
  `

  conn.query(sql, [username], function(err, results, fields){
    const hashedPassword = results[0].password

    bcrypt.compare(password, hashedPassword).then(function(result){
      if (result) {
        const token = uuid()

        const tokenUpdateSQL = `
          UPDATE users
          SET token = ?
          WHERE username = ?
        `

        conn.query(tokenUpdateSQL, [token, username], function(err, results, fields){
          res.json({
            token: token
          })
        })
      } else {
        res.status(401).json({
          message: 'You Shall Not Pass!!'
        })
      }
    }).catch(function(err){
      console.log(err)
    })
  })
})

router.post('/register', function(req, res, next){
  const username = req.body.username
  const password = req.body.password
  const token = uuid()

  const sql = `
    INSERT INTO gabblers (username, password, token)
    VALUES (?, ?, ?)
  `

  bcrypt.hash(password, 10).then(function(hashedPassword){
    conn.query(sql, [username, hashedPassword, token], function(err, results, fields){
      res.json({
        message: 'In like Flynn',
        token: token
      })
    })
  })
})

router.get("/", function(req, res, next){
  res.render("index", {appType:"My Gabble"})
})

module.exports = router
