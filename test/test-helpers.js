const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray(){
  return [
    {id: 1,
    user_name: 'test-user-1',
  password: 'password',
  email: '123@123.com',
date_created: new Date()
},
{id: 2,
  user_name: 'test-user-2',
password: 'password',
email: '123@1234.com',
date_created: new Date()
},
{id: 3,
  user_name: 'test-user-3',
password: 'password',
email: '123@12345.com',
date_created: new Date()
},
  ]
}

function makeMovementsArray(){
  return [
    {
      id: 1,
      movement_name:'squat',
      body_part:'legs',
      reps: '20',
      equipment: 'barbell'
    },
    {
      id: 2,
      movement_name:'pushup',
      body_part:'arms',
      reps: '20',
      equipment: '', 

    },
    {
      id: 3,
      movement_name:'pullup',
      body_part:'back',
      reps: '1',
      equipment: 'pullup bar', 
    },
    {
      id: 4,
      movement_name:'burpee',
      body_part:'full-body',
      reps: '20',
      equipment: '', 
    },
    {
      id: 5,
      movement_name:'plank',
      body_part:'full-body',
      reps: '20 seconds',
      equipment: '', 
    }
  ]
}

function makeWorkoutsArray(users) {
  return [
    {
      id: 1,
      user_id: users[0].id,
      workout_length: 30,
      date_created: new Date()
     
    },
    {
      id: 2,
      user_id: users[1].id,
      workout_length: 20,
      date_created: new Date()
    },
    {
      id: 3,
      user_id: users[2].id,
      workout_length: 50,
      date_created: new Date()
    }
  ]
}
function makeWorkoutsMovementsArray(workout, movement){
  return [
    {workout_id:workout[0].id, movement_id:movement[0].id},
    {workout_id:workout[0].id, movement_id:movement[1].id},
    {
    workout_id:workout[0].id, movement_id:movement[2].id
    },
    {workout_id:workout[1].id, movement_id:movement[3].id},
    {workout_id:workout[1].id, movement_id:movement[4].id},
    {workout_id:workout[1].id, movement_id:movement[0].id},
    {workout_id:workout[2].id, movement_id:movement[0].id},
    {workout_id:workout[2].id, movement_id:movement[1].id},
    {workout_id:workout[2].id, movement_id:movement[2].id},

  ]

}
function makeFixtures(){
  const testUsers = makeUsersArray()
  const testMovements = makeMovementsArray()
  const testWorkouts = makeWorkoutsArray(testUsers, testMovements)
  const testWorkoutsMovements = makeWorkoutsMovementsArray(testWorkouts, testMovements)
  return { testUsers, testMovements, testWorkouts, testWorkoutsMovements}
}
function cleanTables(db){
  return db.transaction(trx=>
    trx.raw(
      `TRUNCATE
      workouts_movements,
      workouts,
      amrap_users,
      movements`
    )
    .then(()=> 
    Promise.all([
      trx.raw('ALTER SEQUENCE workouts_id_seq minvalue 0 START WITH 1'),
      trx.raw(`ALTER SEQUENCE amrap_users_id_seq minvalue 0 START WITH 1`),
      trx.raw(`ALTER SEQUENCE movements_id_seq minvalue 0 START WITH 1`),
      trx.raw(`SELECT setval('workouts_id_seq', 0)`),
      trx.raw(`SELECT setval('amrap_users_id_seq', 0)`),
      trx.raw(`SELECT setval('movements_id_seq', 0)`)
    ])
    )
    )
}
function seedUsers(db, users){
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('amrap_users').insert(preppedUsers)
  .then(()=>
  db.raw(
    `SELECT setval('amrap_users_id_seq', ?)`,
    [users[users.length-1].id],
  ))
}
function seedAmrapTables(db, users, movements, workouts=[], workouts_movements=[]){
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('movements').insert(movements)
    await trx.raw(`SELECT setval('movements_id_seq', ?)`,
    [movements[movements.length -1].id],
    )
    if(workouts.length){
      await trx.into('workouts').insert(workouts)
      await trx.raw(
        `SELECT setval('workouts_id_seq', ?)`,
        [workouts[workouts.length-1].id]
      )
      await trx.into('workouts_movements').insert(workouts_movements)
      
    }
  })
}
function makeAuthHeader(user, secret=process.env.JWT_SECRET){
  const token = jwt.sign({user_id: user.id}, secret, {
    subject: user.user_name,
    algorithm: 'HS256'
  })
  return `Bearer ${token}`
}
module.exports = {
  makeMovementsArray,
  makeUsersArray,
  makeWorkoutsArray,
  makeAuthHeader,
  makeFixtures,
  seedAmrapTables,
  cleanTables,
  seedUsers
}