/* global User */
module.exports = {
  /**
   * Delete user record.
   *
   * @param {*} req
   * @param {*} res
   */
  destroy ( req, res ) {
    User.update( req.user.id, {
      isEnabled: false
    } )
      .then( user => {
        return res.ok();
      } )
      .catch( res.serverError );
  },

  /**
   * Get self obj
   *
   * @param {*} req
   * @param {*} res
   */
  async getSelf ( req, res ) {
    return res.json( _.omit( req.user, User.omissions ) );
  },

  async update ( req, res ) {
    // They should never update the following:
    const userParams = _.omit( req.allParams(), ['id', 'isEnabled', 'password', 'createdAt', 'updatedAt'] );

    // Special check if they updated email
    const passedEmail = req.param( 'email' );

    if ( passedEmail && passedEmail !== req.user.email ) {
      const duplicateEmail = await User.count( {
        email: passedEmail,
        id: {
          '!=': [req.user.id]
        },
        isEnabled: true
      } );

      if ( duplicateEmail ) {
        return res.badRequest( 'A user with this email already exists.' );
      }
    }

    // Save
    const updatedUser = await User.update( req.user.id, userParams )
      .fetch()
      .catch( err => {
        return res.badRequest( err.message );
      } );

    return res.json( updatedUser[0] );
  }
};
