const express = require('express')
const mustacheExpress = require('mustache-express');
const path = require('path');
const app = express()
const bodyParser = require('body-parser')

const Authenticate = require("./middleware/auth")

const protectedRoutes = require("./routes/protected")

const publicRoutes = require("./routes/public")

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')
app.use(express.static(path.join(__dirname, 'static')))
app.use('/', publicRoutes)
app.use('/api', Authenticate, protectedRoutes)

// Form to create new posts
app.get("/createpost", function(req, res, next){
  res.render("createpost", {appType:"Create New Post:"})
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



app.listen(3000, function(){
  console.log("App running on port 3000")
})
