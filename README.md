# AMRAP API

This is an express server and seed data for the AMRApp

## Set up
1. Install dependencies: `npm install`
2. Create development and test databases: `createdb amrap`, `createdb amrap-test`
3. Create database user : ex/ `createuser amrap`
4. Grant privileges to user for DB
5. Prep .env `cp example.env .env`
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

