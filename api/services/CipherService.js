const bcrypt = require( 'bcrypt-nodejs' );
const jwt = require( 'jsonwebtoken' );
const crypto = require( 'crypto' );

module.exports = {
  audience: sails.config.jwtSettings.audience,

  /**
   * Compare user password hash with unhashed password
   * @returns boolean indicating a match
   */
  comparePassword: function ( password, user ) {
    return bcrypt.compareSync( password, user.password );
  },
  createRandomID: function () {
    return crypto.randomBytes( 48 ).toString( 'hex' );
  },

  /**
   * Create a token based on the passed user
   * @param user
   */
  createToken: function ( user ) {
    return jwt.sign(
      {
        user: user.toJSON()
      },
      sails.config.jwtSettings.secret,
      {
        algorithm: sails.config.jwtSettings.algorithm,
        audience: sails.config.jwtSettings.audience,
        expiresIn: sails.config.jwtSettings.expiresInMinutes,
        issuer: sails.config.jwtSettings.issuer
      }
    );
  },

  /**
   * Hash the password field of the passed user.
   */
  hashPassword: function ( user ) {
    if ( user.password ) {
      user.password = bcrypt.hashSync( user.password );
    }
  },
  issuer: sails.config.jwtSettings.issuer,
  secret: sails.config.jwtSettings.secret
};
