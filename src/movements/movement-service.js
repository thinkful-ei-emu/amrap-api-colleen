const MovementService = {
  getAllMovements(db) {
    return db.select("*").from("movements");
  },
  hasMovementWithMovementName(db, movement_name) {
    return db("movements")
      .where({ movement_name })
      .first()
      .then(movement => !!movement);
  },
  insertMovement(db, newMovement) {
    return db
      .insert(newMovement)
      .into("movements")
      .returning("*")
      .then(([movement]) => movement);
  },
  getMovementById(db, movementId) {
    return db
      .select("*")
      .from("movements")
      .where("id", movementId)
      .first();
  },
  deleteMovement(db, movementId) {
    return db
      .from("movements")
      .where("id", movementId)
      .delete();
  }
};

module.exports = MovementService;
