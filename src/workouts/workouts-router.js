const express = require('express')
const { requireAuth } = require('../middleware/jwt-auth')
const WorkoutsService = require('./workouts-service')
const workoutsRouter = express.Router()
const jsonBodyParser = express.json()

workoutsRouter
.route('/')
.get((req, res)=>{
WorkoutsService.getAllWorkouts(req.app.get('db'))
.then(workouts => {
  return res.status(200).json(workouts)
})
})
.post(jsonBodyParser, (req, res)=>{
  const { workout_length, equipment} = req.body
  const searchObj = { workout_length, equipment} 
  const requiredItem = {workout_length}
  for(const[key, value] of Object.entries(requiredItem)){
    if (value == null){
      return res
      .status(400)
      .json({error: `Missing ${key} in request body`})
    }
  }
  // let query = WorkoutsService.formEquipmentSearch(searchObj)
  WorkoutsService.search(req.app.get('db'), searchObj)
  .then(result =>{
    console.log(result);
    return res.status(201).json(result)
  })
   // let search = WorkoutsService.organizeRandomOutput(result)
  
 // })
 
})

workoutsRouter
.route('/:userId')
.all((req, res, next)=> {
  WorkoutsService.getWorkoutByUserId(req.app.get('db'), req.params.userId)
  .then(workouts =>{
    if(!workouts){
      return res.status(400).json({error: 'User or workouts do not exist'})
    }
    res.workouts = workouts;
    next()
  })
  .catch(next)
})
.get(jsonBodyParser,(req, res)=>{
  console.log(res.workouts)
 let workouts= WorkoutsService.organizeWorkouts(res.workouts)
    return res.json(workouts)
  
  
})

module.exports = workoutsRouter