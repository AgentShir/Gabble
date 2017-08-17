const express = require('express')
const app = express()
const path = require('path')
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser')
const config = require('config')
const mysql = require('mysql')
const uuid = require('uuid')
const bcrypt = require('bcrypt')

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

// Following the tokenAuth lecture
app.post("/login", function(req, res, next){
  const username = req.body.username
  const password = req.body.password

  const sql = `
  SELECT password from gabble_tokens
  WHERE username = ?
  `

  conn.query(sql, [username], function(err, results, fields){
    const hashedPassword = results[0]

    bcrypt.compare(password, hashedPassword).then(function(res){
      if (res){
        const token = uuid()
        res.json({
          token: token
        })
      } else {
        res.status(401).json({
          message: "You Shall Not Pass"
        })
      }
    })
  })
})

app.post("/register", function(req, res, next){
  const username = req.body.username
  const password = req.body.password

  const sql = `
  INSERT into gabble_tokens (username, password)
  VALUES (? , ?)
  `
  bcrypt.hash(password).then(function(hashedPassword){
    conn.query(sql, [username, hashedPassword], function(err, results, fields){
      res.json({
        message: "You're in like Flynn"
      })
    })
  })

})

//Todo: Figure out where this goes. This is the signup page for Gabble (Bruce, Max, Boots, Connor. PS - They're all dogs).
// Todo: ADD PASSWORD TO FORM

app.post("/", function(req, res, next){
  const username = req.body.username
  const displayname = req.body.displayname
  const fname = req.body.fname
  const lname = req.body.lname
// Todo: ADD PASSWORD!!!!

  const sql = `
    INSERT INTO gabblers (username, displayname, fname, lname)
    VALUES (?, ?, ?, ?)
  `

  conn.query(sql, [username, displayname, fname, lname], function(err, results, fields){
    if (!err) {
      console.log('It seems to work')
      res.redirect("/")
    } else {
      console.log(err)
      res.send("Fix it!!!")
    }
  })
})

// Getting createmessage.mustache to work
app.get("/createmessage", function(req, res, next){
  res.render("createmessage", {appType:"Create New Message:"})
})

// Getting the new message to post
app.post("/mygabble", function(req, res, next){
  res.render("mygabble", {appType:"Your Message"})
})

// This points to signup. It might. I'm writing notes because I keep mixing the damn things up.
app.get("/signup", function(req, res, next){
  res.render("signup", {appType:"Signup for Gabble!"})
})
// Todo: signup for Gabble or click to login if already a user

app.post("/login", function(req, res){
  // Todo: login form
})

app.get("/", function(req, res, next){
  res.render("index", {appType:"My Gabble"})
})

app.listen(3000, function(){
  console.log("App running on port 3000")
})
