const WorkoutsService = {
  getAllWorkouts(db) {
    return db.from("workouts").select("*");
  },

  search(db, searchObj) {
    let equipment = searchObj.equipment.replace(" ", "|");
    //returns random number to generate workouts by if time is greater than 15 min,
    //if less than 15, num_exercises will be 2.
    let num_exercises = Math.floor(Math.random() * (5 - 3 + 1) + 3);
    if (searchObj.workout_length >= 15){
    return db("movements")
      .select("*")
      .where(db.raw(`equipment SIMILAR TO '${equipment}'`))
      .orWhereNull("equipment")
      .orderByRaw("RANDOM()")
      .limit(num_exercises);
    }
    else {
     return db("movements")
      .select("*")
      .where(db.raw(`equipment SIMILAR TO '${equipment}'`))
      .orWhereNull("equipment")
      .orderByRaw("RANDOM()")
      .limit(2);
    }
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
        "reps",
        "side",
        "video"
      )
      .where({ user_id });
  },
  getNewWorkout(db, workout_id) {
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
        "reps",
        "video"
      )
      .where({ workout_id });
  },
  
  
  organizeWorkouts(workouts) {
    //takes objects from join table and reduces to array of objects by workout ID
    let list = workouts.reduce(function(r, a) {
      r[a.workout_id] = r[a.workout_id] || [];
      r[a.workout_id].push(a);
      return r;
    }, {});
    //reorganizes array
    let listWorkouts = [];
    for (let key in list) {
      listWorkouts.push(list[key]);
    }

    let mvtArray = [];
    //then takes only list of movements to new array and reduces to new object which
    //filters out extra workout length and workout ID for consise display of workout, with movements
    //listed in array of objects format
    for (let i = 0; i < listWorkouts.length; i++) {
      listWorkouts[i].forEach(workout => {
        mvtArray.push(workout);
      });
    }
    let result = Object.values(
      mvtArray.reduce(
        (
          c,
          {
            workout_id,
            movement_id,
            movement_name,
            reps,
            equipment,
            workout_length,
            video
          }
        ) => {
          c[workout_id] = c[workout_id] || { workout_id, movements: [] };
          c[workout_id].workout_length = workout_length;
          c[workout_id].movements = c[workout_id].movements.concat(
            Array.isArray(movement_name)
              ? movement_name
              : [{ movement_name: movement_name, reps, equipment, movement_id, video }]
          );
          return c;
        },
        {}
      )
    );
    return result;
  },
  insertNewWorkoutIntoWorkouts(db, newWorkout) {
    return db
      .insert(newWorkout)
      .into("workouts")
      .returning("*")
      .then(rows => rows[0]);
  },
  insertNewWorkoutIntoWorkoutsMovements(db, id, newWorkoutMovements) {
    let workoutId = id;

    let newWorkoutsMovementsArray = newWorkoutMovements.movements.map(mvt => {
      return { workout_id: workoutId, movement_id: mvt.id };
    });

    return db
      .insert(newWorkoutsMovementsArray)
      .into("workouts_movements")
      .returning("*")
      .where("workout_id", "=", id);
  },
  deleteWorkout(db, workoutId) {
    let id = workoutId.workout_id;
    return db("workouts_movements")
      .where("workout_id", "=", id)
      .delete();
  }
};

module.exports = WorkoutsService;

/* process for adding workouts in Raw SQL:
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
