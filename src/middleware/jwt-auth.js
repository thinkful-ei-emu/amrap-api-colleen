const AuthService = require('../auth/auth-service')

function requireAuth(req, res, next) {
  
  const authToken = req.get('authorization')

  let bearerToken
  if(!authToken || !authToken.toLowerCase().startsWith('bearer')) {
  return res.status(401).json({error: 'Missing bearer token'})
  } else {
    bearerToken = authToken.slice(7, authToken.length)
  }
  try {
    const payload = AuthService.verifyJwt(bearerToken)
    AuthService.getUserWithUsername(
      req.app.get('db'),
      payload.sub,
    )
    .then(user=> {
      if(!user)
      return res.status(401).json({error: 'Unauthorized request'})
      req.user = user
      console.log(req.params.userId)
      if(req.user.id != req.params.userId)
      return res.status(401).json({error: 'Unauthorized request'})
      req.user = user
     next()
    })
    /* .then(user => {
      console.log(user)
      if (user.id !== req.params.userId)
        return res.status(401).json({error: 'Unauthorized request'})
      req.user = user
     next()
    }) */
    .catch(err =>{
      console.error(err)
      next(err)
    })
  } catch(error){
    res.status(401).json({error: 'Unauthorized request'})
  } 

  
}

module.exports = {
  requireAuth,
}