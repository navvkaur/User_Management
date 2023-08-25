const express = require('express')
const app = express()
const { connection } = require('./Config/database')
const session = require('express-session')
const routes = require('./routes')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const helmet = require('helmet')
var server = require('http').createServer(app);

require('dotenv').config()

//CORS 
var corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(morgan('dev'))
app.use(helmet())
app.use(session({ secret: process.env.SESSION_SECRET }))
app.use(express.urlencoded({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true }, { limit: '50mb' }))

  //DB CONNECTION
  ; (async () => await connection())()

// // TESTING
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.json(['SERVER IS LIVE!'])
})

// ROUTING API URL OF EACH MODULE
app.use(express.json())
routes.map(route => {
  app.use(route.path, route.handler)
})

// LAUNCHING THE SERVER
const PRT = process.env.PORT || 3001
server.listen(PRT, () => {
  console.log(
    `________________________________\n 🚀 Server running on PORT ${PRT}\n________________________________\n`
  )
})

