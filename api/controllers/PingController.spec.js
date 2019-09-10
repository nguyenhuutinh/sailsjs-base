describe( 'PingController', () => {
  it( 'ping: should test the ping response.', done => {
    sails.testData
      .supertest( sails.hooks.http.app )
      .get( '/ping' )
      .expect( 200 )
      .then( async res => {
        done();
      } )
      .catch( err => {
        done( err );
      } );
  } );
} );
