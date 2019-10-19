/**
 * AuthController
 * @description :: Server-side logic for manage user's authorization
 */
/* global User, CipherService, MailerService */
const passport = require( 'passport' );
const validator = require( 'validator' );

/**
 * Triggers when user authenticates via passport
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Object} error Error object
 * @param {Object} user User profile
 * @param {Object} info Info if some error occurs
 * @private
 */
async function _onPassportAuth ( req, res, error, user, info ) {
  if ( error ) {
    return res.serverError( error );
  }
  if ( !user ) {
    return res.forbidden( null, info && info.code, info && info.message );
  }

  // Add issuer and audience
  user.issuer = sails.config.issuer;
  user.audience = sails.config.audience;

  // Generate new random pass
  // const randomPass = CipherService.createRandomID();

  // // Update the password. Doesn't have to be sync
  // await User.update( user.id, {
  //   password: randomPass
  // } );

  return res.status(200).json({
    token: CipherService.createToken( user ),
    user: _.omit( user, User.omissions ),
    currentAuthority: user.isSuperAdmin ? 'admin': 'user'
  } );
}

module.exports = {
  async sendMagicLink ( req, res ) {
    const email = req.param( 'e' ).replace( ' ', '+' );

    if ( !email || !validator.isEmail( email ) ) {
      return res.badRequest( 'Invalid login credentials.' );
    }

    const user = await User.findOne( {
      email,
      isEnabled: true
    } );

    if ( !user ) {
      return res.badRequest( 'Invalid login credentials.' );
    }

    // Generate random pass
    const randomPass = "abcd1234";

    // Update the user's account and wait!
    await User.update( user.id, {
      password: randomPass
    } );
    // console.log(sails.config.urls.fe_url)
    // Send the email
    MailerService.send(
      {
        // TODO: Update the login email info!
        subject: 'Magic Link!',
        templateData: {
          // TODO: Change this destination.
          
          link: `${sails.config.urls.fe_url}/#/validate?e=${encodeURI( user.email )}&p=${encodeURI( randomPass )}`,
          user: user
        },
        templatePath: 'emailTemplates/magicLink.ejs',
        to: user.email
      },
      ( err, response ) => {
        // This failure is ok in testing.
        if ( err && process.env.NODE_ENV !== 'test' ) {
          return res.serverError( err );
        } else {
          return res.ok();
        }
      }
    );
  },

  /**
   * Sign in by local strategy in passport
   * @param {Object} req Request object
   * @param {Object} res Response object
   */
  signin ( req, res ) {
    passport.authenticate( 'local', _onPassportAuth.bind( this, req, res ) )( req, res );
  },
  logout: function(req, res) {
    
    req.logout();
    req.session.destroy(function(err) {
      
      res.clearCookie('sails.sid');
      return res.ok()
    })
  },
  /**
   * Sign up in system
   * @param {Object} req Request object
   * @param {Object} res Response object
   */
  async signup ( req, res ) {
    const username = req.param( 'username' );
    const email = req.param( 'email' );
    const password = req.param( 'password' );

    // TODO: Uncomment if you want to collect a password and use it below
    // const password = req.param('password');

    if ( !email || !validator.isEmail( email ) ) {
      return res.badRequest( 'Invalid email.' );
    }

    // Search for an existing user
    const existingUser = await User.findOne( {
      email: email,
      isEnabled: true
    } );

    if ( existingUser ) {
      return res.badRequest( 'User already exists.' );
    }

    // TODO: Replace with a passed in password if desired.
    const newPassword = password;

    const newUser = await User.create( {
      email: email,
      isCustomer: true,
      password: newPassword,
      username: username
    } )
      .fetch()
      .catch( res.serverError );

    if ( !newUser ) {
      return res.serverError( 'There was a problem creating your account.' );
    }

    MailerService.send( {
      // TODO: Update email message!
      subject: 'Welcome!!',
      templateData: {
        user: newUser
      },
      templatePath: 'emailTemplates/welcome.ejs',
      to: newUser.email
    } );

    return res.ok();
  }
};
