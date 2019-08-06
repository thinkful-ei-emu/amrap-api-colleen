const express = require('express')
const UsersService = require('./users-service')
const path = require('path')

const usersRouter=express.Router()
const jsonBodyParser=express.json()

usersRouter.post('/', jsonBodyParser, (req, res, next)=> {
  const { password, user_name, email} = req.body
  for (const field of ['password', 'user_name', 'email'])
  if(!req.body[field])
  return res
  .status(400)
  .json({error: `Missing ${field} in request body`})

  const passwordError = UsersService.validatePassword(password);
  if(passwordError) {
    return res.status(400).json({error: passwordError})
  }
  UsersService.hasUserWithUsername(req.app.get('db'), user_name)
  .then(userExist => {
    if(userExist)
    return res.status(400).json({error: 'User name already taken'})
  
    return UsersService.hashPassword(password).then(hashedPassword => {
      const newUser = {
        user_name,
        password: hashedPassword,
        email,
        date_created: "now()"
      };
      return UsersService.insertUser(req.app.get('db'), newUser)
      .then(user => {
        res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${user.id}`))
        .json(UsersService.serializeUser(user))
      });
    });
      })
      .catch(next)
});

module.exports = usersRouter