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
      .then( async res => {
        const foundUser = await User.findOne( sails.testData.user.id );
        foundUser.should.have.property( 'isEnabled', false );

        // Re-enable the account
        foundUser.isEnabled = true;
        await User.update( foundUser.id, foundUser );

        done();
      } )
      .catch( done );
  } );

  it( 'getSelf: should test the getSelf endpoint', done => {
    sails.testData
      .supertest( sails.hooks.http.app )
      .get( '/user' )
      .set( 'Authorization', 'bearer ' + sails.testData.jwt )
      .expect( 200 )
      .then( async res => {
        sails.testData.should( res.body ).have.property( 'email', sails.testData.fixtures.user[0].email );

        done();
      } )
      .catch( done );
  } );

  it( 'update: should test the update endpoint', done => {
    sails.testData
      .supertest( sails.hooks.http.app )
      .patch( '/user/' + sails.testData.user.id )
      .set( 'Authorization', 'bearer ' + sails.testData.jwt )
      .send( {
        firstName: 'new first name'
      } )
      .expect( 200 )
      .then( async res => {
        sails.testData.should( res.body ).have.property( 'firstName', 'new first name' );

        // Change it back
        await User.update( sails.testData.user.id, { firstName: sails.testData.fixtures.user[0].firstName } );

        done();
      } )
      .catch( done );
  } );
} );
