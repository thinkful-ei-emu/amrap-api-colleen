
const MovementService = {
  getAllMovements(db){
    return db
    .select('*')
    .from('movements')
  },
  hasMovementWithMovementName(db, movement_name){
    return db('movements')
    .where({movement_name})
    .first()
    .then(movement=> !!movement)
  },
  insertMovement(db, newMovement){
    return db
    .insert(newMovement)
    .into('movements')
    .returning('*')
    .then(([movement]) => movement)
  }
}

module.exports = MovementService