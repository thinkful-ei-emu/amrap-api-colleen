const expect = require('chai').expect
const supertest = require('supertest')

require('dotenv').config()

global.expect = expect
global.supertest = supertest

process.env.TZ = 'UCT'
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret'
process.env.JWT_EXPIRY = '3m'

process.env.TEST_DB_URL = process.env.TEST_DB_URL