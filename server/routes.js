const user = require('./modules/user/routes/UserRoute')

module.exports = [
    {
      path: '/portal',
      handler: user,
      schema: 'User'
    },     
]