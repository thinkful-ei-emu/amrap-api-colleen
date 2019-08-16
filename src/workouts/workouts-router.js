const express = require("express");
const { requireAuth, requireAdminAuth } = require("../middleware/jwt-auth");
const WorkoutsService = require("./workouts-service");
const workoutsRouter = express.Router();
const jsonBodyParser = express.json();
const path = require("path");

workoutsRouter
  .route("/")
  .get(requireAuth, (req, res) => {
    WorkoutsService.getAllWorkouts(req.app.get("db")).then(workouts => {
      return res.status(200).json(workouts);
    });
  })
  .post(jsonBodyParser, (req, res) => {
    const { workout_length, equipment } = req.body;
    const searchObj = { workout_length, equipment };
    const requiredItem = { workout_length };
    for (const [key, value] of Object.entries(requiredItem)) {
      if (value == null) {
        return res
          .status(400)
          .json({ error: `Missing ${key} in request body` });
      }
    }
    WorkoutsService.search(req.app.get("db"), searchObj).then(result => {
      return res.status(201).json(result);
    });
  });

workoutsRouter
  .route("/:userId")
  .all(requireAuth, (req, res, next) => {
    WorkoutsService.getWorkoutByUserId(req.app.get("db"), req.params.userId)
      .then(workouts => {
        if (!workouts) {
          return res
            .status(400)
            .json({ error: "User or workouts do not exist" });
        }
        res.workouts = workouts;
        next();
      })
      .catch(next);
  })
  .get(jsonBodyParser, (req, res) => {
    let workouts = WorkoutsService.organizeWorkouts(res.workouts);
    return res.json(workouts);
  })
  .delete(jsonBodyParser, (req, res)=>{
    const {workout_id}= req.body;
    let workoutToBeDeleted = {workout_id}
    WorkoutsService.deleteWorkout(req.app.get('db'), workoutToBeDeleted)
    .then(()=> res.status(204).end())
  })
  .post(jsonBodyParser, (req, res) => {
    const { workout_length, user_id, movements } = req.body;
    let newWorkout = { workout_length, user_id, movements };
    let newWorkoutRow = { workout_length, user_id };
    let newWorkoutMovements = { movements };

    for (const [key, value] of Object.entries(newWorkout)) {
      if (value == null) {
        return res
          .status(400)
          .json({ error: `Missing ${key} in request body` });
      }
    }
    WorkoutsService.insertNewWorkoutIntoWorkouts(
      req.app.get("db"),
      newWorkoutRow
    ).then(newRow => {
      WorkoutsService.insertNewWorkoutIntoWorkoutsMovements(
        req.app.get("db"),
        newRow.id,
        newWorkoutMovements
      ).then(() => {
        WorkoutsService.getNewWorkout(req.app.get("db"), newRow.id).then(
          rawWkt => {
            let newWorkout = WorkoutsService.organizeWorkouts(rawWkt);
            return res
              .status(201)
              .location(
                path.posix.join(
                  req.originalUrl + `/${newWorkout[0].workout_id}`
                )
              )
              .json(newWorkout);
          }
        );
      });
    });
  });

module.exports = workoutsRouter;
