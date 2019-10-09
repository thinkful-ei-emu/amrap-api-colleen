require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const workoutsRouter = require('./workouts/workouts-router')
const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router')
const movementRouter = require('./movements/movement-router')
const app = express()
app.use(cors())

//if production, want morgan to change based on prod vs dev
const morganOption = (NODE_ENV === 'production' 
 ? 'common' 
 : 'tiny')
 
 app.use(morgan(morganOption))
 app.use(helmet())
 
 app.use('/api/workouts', workoutsRouter)
 app.use('/api/users', usersRouter)
 app.use('/api/auth', authRouter)
 app.use('/api/movements', movementRouter)
 app.use(function errorHandler(error, req, res, next){
   let response
   if (NODE_ENV === 'production') {
     response = { error : { message: 'server error'}}
   } else {
     console.error(error)
     response = { message: error.message, error }
   }
   res.status(500).json(response)
 })


 module.exports = app