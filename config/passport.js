/* global User, CipherService */
/**
 * Passport configuration file where you should configure strategies
 */
const passport = require( 'passport' );
const LocalStrategy = require( 'passport-local' ).Strategy;
const JwtStrategy = require( 'passport-jwt' ).Strategy;
const ExtractJwt = require( 'passport-jwt' ).ExtractJwt;

const EXPIRES_IN_MINUTES = 500000;
const ALGORITHM = 'HS256';

// TODO: Change these before deploying!
const SECRET = process.env.passport_tokenSecret || 'PZ*gTBGHLdotZyM*@M.MkYKFpkabPYNU!2@r';
const ISSUER = process.env.passport_issuer || 'yoursite.com';
const AUDIENCE = process.env.passport_audience || 'yoursite.com';

/**
 * Configuration object for local strategy
 */
const LOCAL_STRATEGY_CONFIG = {
  passReqToCallback: false,
  passwordField: 'password',
  usernameField: 'email'
};

/**
 * Configuration object for JWT strategy
 */
const JWT_STRATEGY_CONFIG = {
  audience: AUDIENCE,
  ignoreExpiration: true,
  issuer: ISSUER,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  passReqToCallback: false,
  secretOrKey: SECRET
};

/**
 * Triggers when user authenticates via local strategy
 */
async function _onLocalStrategyAuth ( email, password, next ) {
  const user = await User.findOne( {
    email: email,
    isEnabled: true
  } );

  if ( !user ) {
    return next( null, false, {
      code: 'E_USER_NOT_FOUND',
      message: 'Incorrect login information'
    } );
  }

  if ( !CipherService.comparePassword( password, user ) ) {
    return next( null, false, {
      code: 'E_WRONG_PASSWORD',
      message: 'Incorrect login information'
    } );
  }

  return next( null, user, {} );
}

/**
 * Triggers when user authenticates via JWT strategy
 */
function _onJwtStrategyAuth ( payload, next ) {
  const user = payload.user;
  return next( null, user, {} );
}

passport.use( new LocalStrategy( LOCAL_STRATEGY_CONFIG, _onLocalStrategyAuth ) );
passport.use( new JwtStrategy( JWT_STRATEGY_CONFIG, _onJwtStrategyAuth ) );

module.exports.jwtSettings = {
  algorithm: ALGORITHM,
  audience: AUDIENCE,
  expiresInMinutes: EXPIRES_IN_MINUTES,
  issuer: ISSUER,
  secret: SECRET
};
