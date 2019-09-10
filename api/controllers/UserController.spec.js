/* global User */
describe( 'UserController', () => {
  before( done => {
    sails.testData.clearFixtures().then( () => {
      sails.testData.login().finally( done );
    } );
  } );

  it( 'destroy: should test the destroy endpoint', done => {
    sails.testData
      .supertest( sails.hooks.http.app )
      .delete( '/user/' + sails.testData.user.id )
      .set( 'Authorization', 'bearer ' + sails.testData.jwt )
      .expect( 200 )
      .end( async ( err, res ) => {
        if ( err ) {
          return done( err );
        }
        const foundUser = await User.findOne( sails.testData.user.id );
        foundUser.should.have.property( 'isEnabled', false );

        // Re-enable the account
        foundUser.isEnabled = true;
        await User.update( foundUser.id, foundUser );

        done();
      } );
  } );
} );
