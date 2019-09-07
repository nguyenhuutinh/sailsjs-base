/* global TemplateService */

const path = require( 'path' );

// TODO: Be sure you define a config object for email.provider.
const provider = require( path.join( __dirname, 'EmailProviders', sails.config.email.provider ) );

module.exports = {
  send ( data, cb = function () {} ) {
    // Set the from
    data.from = sails.config.email.from;

    // Dynamically load the module based on the ENV var.
    try {
      // If they pass both, we take templatePath as priority.
      if ( _.has( data, 'templatePath' ) && _.has( data, 'templateData' ) ) {
        TemplateService.buildTemplate( data.templatePath, data.templateData, ( err, view ) => {
          if ( err ) {
            return cb( err );
          } else {
            data.message = view;

            // Call said provider
            provider.send( data, cb );
          }
        } );
      } else {
        // Call said provider
        provider.send( data, cb );
      }
    } catch ( err ) {
      return cb( err );
    }
  }
};
