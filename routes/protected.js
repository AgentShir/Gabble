const express = require('express')
const router = express.Router()

// what's securepath, watch lecture

router.get('/securepath', function(req, res, next){
  res.json({
    message: "The radar has been jammed."
  })
})

// what's asdf, watch lecture

router.get('/asdf', function(req, res, next){
  res.json({
    message: "Comb the desert!"
  })
})

module.exports = router
