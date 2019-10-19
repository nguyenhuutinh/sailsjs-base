/* global before, after */
const sails = require( 'sails' );
const Fixtures = require( 'node-mongodb-fixtures' );
const should = require( 'should' );
const supertest = require( 'supertest' );
const fs = require( 'fs' );
const path = require( 'path' );
const fixturesPath = './test/fixtures';

/**
 * Init fixtures
 */
const fixtures = new Fixtures( {
  dir: fixturesPath,
  mute: true
} );

/**
 * Vars always available in testing context.
 */
sails.testData = {
  clearFixtures: () => {
    return (
      fixtures
        // TODO: Change if not using Mongo
        .connect( 'mongodb://localhost:27017/_test' )
        .then( () => fixtures.unload() )
        .then( () => fixtures.load() )
        .then( () => {
          fixtures.disconnect();
        } )
    );
  },
  fixtures: {},
  jwt: null,
  login: async () => {
    return sails.testData
      .supertest( sails.hooks.http.app )
      .post( '/auth/signin' )
      .send( {
        email: sails.testData.fixtures.user[0].email,
        password: sails.testData.testUser.password
      } )
      .then( res => {
        _.set( sails, 'testData.user', _.get( res, 'body.user' ) );
        _.set( sails, 'testData.jwt', _.get( res, 'body.token' ) );
      } );
  },
  should: should,
  supertest: supertest,
  testUser: {
    email: 'testuser@testemail.com',
    password: 'mypassword1!',
    username: 'test_username'
  }
};

before( done => {
  sails.lift(
    {
      hooks: { grunt: false },
      log: { level: 'warn' }
    },
    err => {
      if ( err ) return done( err );

      /**
       * Read in all fixtures so they are accessible later. Filename is the property
       * to use.
       */
      const files = fs.readdirSync( fixturesPath );
      files.forEach( file => {
        try {
          const filePath = path.join( fixturesPath, file );
          sails.testData.fixtures[path.parse( filePath ).name] = JSON.parse( fs.readFileSync( filePath ) );
        } catch ( e ) {
          done( e );
        }
      } );
    }
  );

  sails.testData.clearFixtures().then( () => {
    done();
  } );
} );

after( done => {
  // console.log();
  sails.lower( done );
} );
