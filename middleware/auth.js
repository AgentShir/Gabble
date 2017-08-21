const conn = require('../lib/db')

function Authenticate(req, res, next) {
  let token = req.get("Authorization")

  if (!token) {
    res.status(401).json({
      message: "You can't sit with us"
    })
  } else {
    token = token.substr(6)

    const sql = `
      SELECT * FROM users
      WHERE token = ?
    `

    conn.query(sql, [token], function(err, results, fields){
      if (results.length > 0) {
        next()
      } else {
        res.status(401).json({
          message: "These are not them, these are their stunt doubles!"
        })
      }
    })
  }
}

module.exports = Authenticate
