CREATE TABLE workouts_movements (
  workout_id INTEGER REFERENCES workouts(id),
  movement_id INTEGER REFERENCES movements(id),
  UNIQUE(workout_id, movement_id)
);