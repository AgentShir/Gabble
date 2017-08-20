const express = require('express')
const app = express()
const path = require('path')
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser')
const config = require('config')
const mysql = require('mysql')
const uuid = require('uuid')
const bcrypt = require('bcrypt')
const session = require('express-session')
const expressValidator = require('express-validator')

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')
app.use(express.static(path.join(__dirname, 'static')))

const conn = mysql.createConnection({
  host: config.get('db.host'),
  database: config.get('db.database'),
  user: config.get('db.user'),
  password: config.get('db.password')
})

function Authenticate(req, res, next){
  const token = req.headers.Authorization

  const sql = `
  SELECT * FROM users
  WHERE token = ?
  `

  conn.query(sql, [token], function(err, results, fields){
    if(results.length > 0){
      next()
    } else {
      res.status(401).json({
          message: "These are not them, these are their stunt doubles!"
      })
    }
  })
}

// Following the tokenAuth lecture
// Todo: Fix error: data and salt arguments required
// Login posts to username and password in gabblers database
app.post("/login", function(req, res, next){
  const username = req.body.username
  const password = req.body.password

  const sql = `
    SELECT password from gabblers
    WHERE username = ?
  `

  conn.query(sql, [username], function(err, results, fields){
    const hashedPassword = results[0].password

    bcrypt.compare(password, hashedPassword).then(function(result){
      if (result){
        const token = uuid()

        const tokenUpdateSQL =`
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
          message: "You Shall Not Pass"
        })
      }
    })
  })
})

app.get("/login", function(req, res, next){
  const username = req.body.username
  const password = req.body.password

  const sql = `
  INSERT into gabblers (username, password)
  VALUES (? , ?)
  `
  bcrypt.hash(password).then(function(hashedPassword){
    conn.query(sql, [username, hashedPassword], function(err, results, fields){
      res.json({
        message: "In like Flynn"
      })
    })
  })
})

//Todo: Figure out where this goes. This is the signup page for Gabble (Bruce, Max, Boots, Connor, Gypsy. PS - They're all dogs).
// Todo: ADD PASSWORD TO FORM

app.post("/", function(req, res, next){
  const displayname = req.body.displayname
  const fname = req.body.fname
  const lname = req.body.lname
  const username = req.body.username
  const password = req.body.password

  const sql = `
    INSERT INTO gabblers (displayname, fname, lname, username, password)
    VALUES (?, ?, ?, ?, ?)
  `

  conn.query(sql, [displayname, fname, lname, username, password], function(err, results, fields){
    if (!err) {
      console.log('It seems to work')
      res.redirect("/")
    } else {
      console.log(err)
      res.send("Fix it!!!")
    }
  })
})

// Form to create new posts
app.get("/createpost", function(req, res, next){
  res.render("createpost", {appType:"Create New Post:"})
})

// Sends new posts to posts database
// Todo: POSTS NOT YET CONNECTED TO USERS
app.post("/createpost", function(req, res, next){
  const gpost = req.body.gpost

  const sql2 =`
  INSERT INTO posts(posts)
  VALUES (?)
  `

  conn.query(sql2, [gpost], function(err, results, fields){
    if (!err){
      console.log('No no bad dog')
      res.redirect("/mygabble")
    } else{
      console.log(err)
      res.send("Fetch!")
    }
  })
})

// Signup page. Signup form.
app.get("/signup", function(req, res, next){
  res.render("signup", {appType:"Signup for Gabble!"})
})
// Todo: signup for Gabble or click to login if already a user

app.get("/mygabble", function(req, res, next){

  // const sql3 =`
  // SELECT * FROM Gabble.posts
  // VALUES (?)
  // `

})

// Login page for registered users
// Forms shows up, isn't functional yet
app.get("/login", function(req, res, next){
  res.render("login", {appType: "Login To Your Gabble"})
})

app.get("/", function(req, res, next){
  res.render("index", {appType:"My Gabble"})
})

app.listen(3000, function(){
  console.log("App running on port 3000")
})
