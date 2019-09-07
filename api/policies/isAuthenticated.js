/**
 * isAuthenticated
 * @description :: Policy to inject user in req via JSON Web Token
 */
/* global User */
var passport = require( 'passport' );

module.exports = function main ( req, res, next ) {
  passport.authenticate( 'jwt', ( error, user, info ) => {
    if ( error ) {
      return res.serverError( error );
    }

    if ( !user ) {
      return res.forbidden( null, info && info.code, info && info.message );
    }

    User.findOne( user.id )
      .then( user => {
        req.user = user;
        next();
      } )
      .catch( err => {
        return res.serverError( err );
      } );
  } )( req, res );
};
