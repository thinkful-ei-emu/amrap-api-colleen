# AMRAP API

This is an express server and seed data for the AMRApp application

## Set up

1. Install dependencies: `npm install`
2. Create development and test databases: `createdb amrap`, `createdb amrap-test`
3. Create database user : ex/ `createuser amrap`
4. Grant privileges to user for DB
5. Prep .env `cp example.env .env`
--/src/config.js contains port and DB url locations, update as needed
6. Replace values with custom values if needed
7. Bootstrap dev database: `MIGRATION_DB_NAME=amrap npm run migrate`
8. Bootstrap test database: `MIGRATION_DB_NAME=amrap-test npm run migrate`

### Configuring Postgres

For tests involving time to run properly, your Postgres database must be configured to run in the UTC timezone.

1. Locate the `postgresql.conf` file for your Postgres installation.
   - OS X, Homebrew: `/usr/local/var/postgres/postgresql.conf`
2. Uncomment the `timezone` line and set it to `UTC` as follows:

```
# - Locale and Formatting -

datestyle = 'iso, mdy'
#intervalstyle = 'postgres'
timezone = 'UTC'
#timezone_abbreviations = 'Default'     # Select the set of available time zone
```

## Sample Data

- To seed the database for development (will truncate automatically before seeding): `psql -U amrap -d amrap -a -f seeds/seed.amrap_tables.sql`

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

##Deploy

Run `heroku push master`

Update proper migration endpoints in postgrator-production and .env

Run `npm run deploy`

Ensure heroku database is seeded (can use seeds/seed.amrap_tables.sql)

## Api Endpoints

All endpoints follow the /api/ path

1. To make a POST request for a random workout as a public user:

POST /api/workouts

Body must include search object with key equipment (space separated string), and workout_length (value between 5 and 60)

2. To make a POST request to save random workout as private user:

POST /api/workouts/:userId
**Request header must contain authorization with JWT token
**Body must contain correctly formatted workout:

[{workout_length: ''}, {user_id: 'your user id'}, {movements: [{movement_name: 'movement_name', reps:'reps', equipment: 'equipment', movement_id: 'movement_id'},{movement_name: 'movement_name', reps:'reps', equipment: 'equipment', movement_id: 'movement_id'},{movement_name: 'movement_name', reps:'reps', equipment: 'equipment', movement_id: 'movement_id'}]}]

3. To login:

POST /api/auth/login

{ user_name: 'username', password: 'password' }

4. To register:

POST /api/users/

{ user_name: 'newUserName', password: 'newPassword', email: 'new@newemail.com}

5. To see all movements: 

GET /api/movements

6. To see one movement: 

GET /api/movements/:movement_id

7. To post new movement:

POST /api/movements

(must contain reps, equipment, movement_name, body_part--as enum type)

