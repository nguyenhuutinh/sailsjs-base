const sg = require( 'sendgrid' )( sails.config.email.secret );
var helper = require( 'sendgrid' ).mail;

module.exports = {
  send ( data, cb = function () {} ) {
    /**
     * We expect a to, from, subjct, and message
     */
    if ( !_.has( data, 'to' ) || !_.has( data, 'from' ) || !_.has( data, 'subject' ) || !_.has( data, 'message' ) ) {
      return false;
    }

    var fromEmail = new helper.Email( data.from );
    var toEmail = new helper.Email( data.to );
    var subject = data.subject;
    var content = new helper.Content( 'text/html', data.message );
    var mail = new helper.Mail( fromEmail, subject, toEmail, content );

    var request = sg.emptyRequest( {
      body: mail.toJSON(),
      method: 'POST',
      path: '/v3/mail/send'
    } );

    sg.API( request, ( error, response ) => {
      if ( error ) {
        return cb( _.get( response, 'body.errors' ) );
      } else {
        return cb( null, response );
      }
    } );
  }
};
