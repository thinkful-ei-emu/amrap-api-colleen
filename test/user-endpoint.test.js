const knex = require("knex");
const app = require("../src/app");
const bcrypt = require("bcryptjs");
const helpers = require("./test-helpers");

describe("Users endpoints", function() {
  let db;

  const { testUsers } = helpers.makeFixtures();
  const testUser = testUsers[0];

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

  describe("POST /api/users", () => {
    context("User Validation", () => {
      beforeEach("insert users", () => helpers.seedUsers(db, testUsers));
      const requiredFields = ["user_name", "password", "email"];
      requiredFields.forEach(field => {
        const registerAttemptBody = {
          user_name: "test user-name",
          email: "test@test.us",
          password: "test password"
        };
        it("responds 400 require error when missing field", () => {
          delete registerAttemptBody[field];
          return supertest(app)
            .post("/api/users")
            .send(registerAttemptBody)
            .expect(400, { error: `Missing ${field} in request body` });
        });
      });
      it('responds 400 "Password must be longer than 8 characters"when empty password', () => {
        const userShortPassword = {
          user_name: "test user_name",
          password: "1234567",
          email: "test@test.us"
        };
        return supertest(app)
          .post("/api/users")
          .send(userShortPassword)
          .expect(400, { error: `Password must be longer than 8 characters` });
      });
      it('responds 400 "Password must be less than 72 characters" when long pw', () => {
        const userLongPassword = {
          user_name: "test user_name",
          password: "*".repeat(73),
          email: "test@test.us"
        };
        return supertest(app)
          .post("/api/users")
          .send(userLongPassword)
          .expect(400, { error: `Password must be less than 72 characters` });
      });
      it("responds 400 when password starts with a space", () => {
        const userPasswordStartSpace = {
          user_name: "test user_name",
          password: " !Aa!2Bb@",
          email: "test@test.us"
        };
        return supertest(app)
          .post("/api/users")
          .send(userPasswordStartSpace)
          .expect(400, {
            error: "Password must not start or end with empty spaces"
          });
      });
      it("responds 400 when password ends with a space", () => {
        const userPasswordEndSpace = {
          user_name: "test user_name",
          password: "!Aa!2Bb@ ",
          email: "test@test.us"
        };
        return supertest(app)
          .post("/api/users")
          .send(userPasswordEndSpace)
          .expect(400, {
            error: "Password must not start or end with empty spaces"
          });
      });
      it("responds 400 error when password is not complex enough", () => {
        const userPasswordNotComplex = {
          user_name: "test user_name",
          password: "11AAaabb",
          email: "test@test.us"
        };
        return supertest(app)
          .post("/api/users")
          .send(userPasswordNotComplex)
          .expect(400, {
            error:
              "Password must contain 1 upper case, lower case, number and special character"
          });
      });
      it('responds 400 "User name already taken"if duplicate', () => {
        const duplicateUser = {
          user_name: testUser.user_name,
          password: "!!AAaa11",
          email: "test@test.us"
        };
        return supertest(app)
          .post("/api/users")
          .send(duplicateUser)
          .expect(400, { error: "User name already taken" });
      });
    });
    context("Happy path", () => {
      it("responds 201, serialized user, storing bcrypted password", () => {
        const newUser = {
          user_name: "test user_name",
          password: "!!AAaa11",
          email: "test@test.us"
        };
        return supertest(app)
          .post("/api/users")
          .send(newUser)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property("id");
            expect(res.body.user_name).to.eql(newUser.user_name);
            expect(res.body.email).to.eql(newUser.email);
            expect(res.body).to.not.have.property("password");
            expect(res.headers.location).to.eql(`/api/users/${res.body.id}`);
            expect(res.body).to.have.property("date_created");
          })
          .expect(res =>
            db
              .from("amrap_users")
              .select("*")
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.user_name).to.eql(newUser.user_name);
                expect(row.email).to.eql(newUser.email);

                return bcrypt.compare(newUser.password, row.password);
              })
              .then(compareMatch => {
                expect(compareMatch).to.be.true;
              })
          );
      });
    });
  });
});
