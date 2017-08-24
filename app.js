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



app.listen(3000, function(){
  console.log("App running on port 3000")
})
