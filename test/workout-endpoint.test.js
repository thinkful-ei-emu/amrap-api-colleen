const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe.only("Workouts endpoints", function() {
  let db;

  const {
    testUsers,
    testMovements,
    testWorkouts,
    testWorkoutsMovements
  } = helpers.makeFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  beforeEach("insert ", () =>
    helpers.seedAmrapTables(
      db,
      testUsers,
      testMovements,
      testWorkouts,
      testWorkoutsMovements
    )
  );

  /*  describe('GET /api/workouts', ()=>{
    it('returns all workouts with status 200', ()=>{
      return supertest(app)
      .get('/api/workouts')
      .expect(200, testWorkouts)
    })
  }) */
  describe("POST /api/workouts", () => {
    it("returns 400 if no search equipment or time given", () => {
      return supertest(app)
        .post("/api/workouts")
        .expect(400);
    });
    it("returns 201 and formatted workout given search includes time", () => {
      const searchItems = { workout_length: "15", equipment: "" };
      return supertest(app)
        .post("/api/workouts")
        .send(searchItems)
        .expect(201)
        .expect(res => {
          expect(res.body).to.be.an("array");
        });
    });
  });
  describe("POST /api/workouts/:userId", () => {
    it("returns 201 when auth user saves workout", () => {
      const secret = process.env.JWT_SECRET
      workoutToSave = {
        workout_length: 15,
        user_id: testUsers[0].id,
        movements: [
          {
            id: testMovements[0].id,
            movement_name: testMovements[0].movement_name,
            reps: testMovements[0].reps,
            equipment: testMovements[0].equipment
          },
          {
            id: testMovements[1].id,
            movement_name: testMovements[1].movement_name,
            reps: testMovements[1].reps,
            equipment: testMovements[1].equipment
          },
          {
            id: testMovements[2].id,
            movement_name: testMovements[2].movement_name,
            reps: testMovements[2].reps,
            equipment: testMovements[2].equipment
          }
        ]
      };
      return supertest(app)
      .post(`/api/workouts/${testUsers[0].id}`)
      .set("Authorization", helpers.makeAuthHeader(testUsers[0],secret))
      .send(workoutToSave)
      .expect(201)
      .expect(res =>{
        expect(res.body).to.be.an('array')
        expect(res.headers.location).to.eql(`/api/workouts/${testUsers[0].id}/${res.body[0].workout_id}`)

      })
    });
  });
});
