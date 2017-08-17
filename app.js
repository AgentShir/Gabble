const express = require('express')
const app = express()
const path = require('path')
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser')
const config = require('config')
const mysql = require('mysql')

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

//Todo: Figure out where this goes. This is the signup page for Gabble (Bruce, Max, Boots, Connor. PS - They're all dogs).
// Todo: ADD PASSWORD TO FORM

app.post("/", function(req, res, next){
  const username = req.body.username
  const displayname = req.body.displayname
  const fname = req.body.fname
  const lname = req.body.lname
// Todo: ADD PASSWORD, I put this twice on purpose.

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
