module.exports = {
  buildTemplate ( viewPath, data, cb = () => {} ) {
    // Build the handlebars view
    const Handlebars = require( 'handlebars' );
    const fs = require( 'fs' );

    try {
      const template = Handlebars.compile( fs.readFileSync( sails.config.paths.views + '/' + viewPath, 'utf-8' ) );
      const view = template( data );

      return cb( null, view );
    } catch ( e ) {
      return cb( e );
    }
  }
};
