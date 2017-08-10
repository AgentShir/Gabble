const express = require('express')
const app = express()
const path = require('path')
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser')
const config = require('config')

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

app.get("/", function(req, res, next){
  res.render("index", {appType:"Signup for Gabble!"})
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
