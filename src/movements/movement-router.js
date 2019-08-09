const express = require('express')
const MovementService = require('./movement-service')
const movementRouter = express.Router()
const jsonBodyParser = express.json()
const path = require('path')

movementRouter
.get('/', (req, res)=>{
  MovementService.getAllMovements(req.app.get('db'))
  .then(movements =>{
    return res.status(200).json(movements)
  })
})
.post('/', jsonBodyParser, (req, res)=>{
 const { movement_name, body_part, equipment, reps} = req.body
 const newMovement = { movement_name, body_part, equipment, reps}
 for (const field of ['movement_name', 'body_part', 'reps'])
 if(!req.body[field])
 return res
 .status(400)
 .json({error: `Missing ${field} in request body`})

 MovementService.hasMovementWithMovementName(req.app.get('db'), newMovement.movement_name)
 .then(movementExist => {
  if(movementExist)
  return res.status(400).json({error: 'Movement_name already exists'})

  return MovementService.insertMovement(req.app.get('db'), newMovement)
  .then(movement => {
    res
    .status(201)
    .location(path.posix.join(req.originalUrl, `/${movement.id}`))
    .json(movement)
  })
})
})
movementRouter
.route('/:movementId')
.all((req, res, next)=> {
  MovementService.getMovementById(req.app.get('db'), req.params.movementId)
  .then(movement =>{
    if(!movement){
      return res.status(400).json({error: 'Movement does not exist'})
    }
    res.movement = movement;
    next()
  })
  .catch(next)
})
.get((req, res)=>{
  return res.json({
    movement_name : res.movement.movement_name,
    body_part: res.movement.body_part,
    equipment: res.movement.equipment,
    reps: res.movement.reps
  })
})
.delete((req, res)=>{
  MovementService.deleteMovement(req.app.get('db'), req.params.movementId)
  .then(()=> {
    return res.status(204).end()
  })
})
module.exports = movementRouter
