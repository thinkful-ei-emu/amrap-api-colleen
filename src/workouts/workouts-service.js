const WorkoutsService = {
  getAllWorkouts(db) {
    return db.from("workouts").select("*");
  },

  search(db, searchObj) {
    let equipment = (searchObj.equipment).replace(" ", "|");
    let num_exercises = Math.floor(Math.random() * (5 - 3 + 1) + 3);
    return db('movements')
    .select('*')
    .where(db.raw(`equipment SIMILAR TO '${equipment}'`))
    .orWhereNull('equipment')
    .orderByRaw('RANDOM()')
    .limit(num_exercises);
  },
  getWorkoutByUserId(db, user_id) {
    return db("workouts")
      .join("workouts_movements", "workout_id", "workouts.id")
      .join("movements", "movement_id", "movements.id")
      .select(
        "date_created",
        "workout_length",
        "workout_id",
        "movement_name",
        "movement_id",
        "equipment",
        "reps"
      )
      .where({ user_id });
  },
  getNewWorkout(db, workout_id){
    return db("workouts")
    .join("workouts_movements", "workout_id", "workouts.id")
    .join("movements", "movement_id", "movements.id")
    .select(
      "date_created",
      "workout_length",
      "workout_id",
      "movement_name",
      "movement_id",
      "equipment",
      "reps"
    )
    .where({ workout_id });
  },
  organizeWorkouts(workouts) {
    let list = workouts.reduce(function(r, a) {
      r[a.workout_id] = r[a.workout_id] || [];
      r[a.workout_id].push(a);
      return r;
    }, {});
    let listWorkouts = [];
    for (let key in list) {
      listWorkouts.push(list[key]);
    }

    let mvtArray = [];
    for (let i = 0; i < listWorkouts.length; i++) {
      listWorkouts[i].forEach(workout => {
        mvtArray.push(workout);
      });
    }
    let result = Object.values(
      mvtArray.reduce(
        (c, { workout_id, movement_id, movement_name, reps, equipment, workout_length }) => {
          c[workout_id] = c[workout_id] || { workout_id, movements: [] };
          c[workout_id].workout_length = workout_length;
          c[workout_id].movements = c[workout_id].movements.concat(
            Array.isArray(movement_name)
              ? movement_name
              : [{ movement_name: movement_name, reps, equipment, movement_id }]
          );
          return c;
        },
        {}
      )
    );
    return result
  },
insertNewWorkoutIntoWorkouts(db, newWorkout){
  return db
  .insert(newWorkout)
  .into('workouts')
  .returning('*')
  .then(rows=>rows[0])
},
insertNewWorkoutIntoWorkoutsMovements(db, id, newWorkoutMovements){
  //newWorkoutMovements: array of objects
  //desired for each newWorkoutMovement: [{ workout_id: , movement_id: }]
  let workoutId = id

let newWorkoutsMovementsArray = newWorkoutMovements.movements.map(mvt =>{
return { workout_id: workoutId, movement_id: mvt.id} 
})

return db
.insert(newWorkoutsMovementsArray)
.into('workouts_movements')
.returning('*')
.where('workout_id', '=', id)
},

};

module.exports = WorkoutsService;

/*
1.
   INSERT INTO workouts 
amrap-> (user_id, workout_length) //from req.body=> array of two objects
amrap-> VALUES
amrap-> (2, 30);
INSERT 0 1

2. find the workout id
amrap=> SELECT id FROM workouts WHERE user_id = 2 AND workout_length = 30;  
 id 
----
  5
(1 row)


3. insert the movement ids
amrap=> INSERT INTO workouts_movements(workout_id, movement_id)
amrap-> VALUES  */
