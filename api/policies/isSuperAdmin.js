/**
 * Only let a user update their own user record.
 */
module.exports = function ( req, res, next ) {
  if ( _.get( req, 'user.isSuperAdmin' ) ) {
    next();
  } else {
    return res.forbidden( 'You do not have permission to do that.' );
  }
};
