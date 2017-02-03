'use strict'
const winston           = require('winston')
const chalk             = require('chalk')
const User              = require('../../../models/User')

module.exports = ( req, res, next ) => {
  let token = req.get('speckle-token')
  if( !token ) {
    winston.debug( chalk.bgRed( 'No token provided.' ) )
    return res.send( { success: false, message:'No token provided.' } )
  }
  winston.debug( chalk.blue.underline('token check: ' + token ))
  
  User.findOne( { apitoken: token } )
  .then( myUser => { 
    if( !myUser ) { 
      throw new Error('No user with this token found. Are ye fooling us?')
      return res.send( { success: false, message:'Token check failed.' } ) 
    }
    req.user = myUser
    return next()
  })
  .catch( err => { 
    winston.debug( chalk.bgRed( 'token check failed: ' + token ) )
    return res.send( { success: false, message:'Token check failed.' } ) 
  } )
}