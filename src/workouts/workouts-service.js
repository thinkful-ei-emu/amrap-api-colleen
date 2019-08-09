const WorkoutsService = {
  getAllWorkouts(db) {
    return db.from("workouts").select("*");
  },
  formEquipmentSearch(searchTermObj) {
    // let query = `WHERE equipment SIMILAR TO `;
    // Equipment example: "barbell dumbell freeweight"
    // Desired string: "barbell|dumbell|freeweight"

    // SELECT * FROM movements WHERE equipment SIMILAR TO '%bell%' OR equipment IS NULL ORDER BY RANDOM() LIMIT (floor(random()*(5-3+1))+3);
  },
  search(db, searchObj) {
    let equipment = (searchObj.equipment).replace(" ", "|");
    let num_exercises = Math.floor(Math.random() * (5 - 3 + 1) + 3);
    console.log("NUMBER IS: " + num_exercises);
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
              : [{ name: movement_name, reps, equipment, movement_id }]
          );
          return c;
        },
        {}
      )
    );
    console.log(result);
    return result
  }
};

module.exports = WorkoutsService;

/* SELECT movements.movement_name, movements.reps, movements.equipment
FROM movements, workouts
WHERE workouts.movement_1 = movements.id
AND workouts.movement_2 = movements.id
AND workouts.id = 1;

SELECT * FROM workouts
WHERE workouts.id = 1

SELECT * FROM workouts AS temptable WHERE temptable.user_id = 1; */
