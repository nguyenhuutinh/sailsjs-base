let replicaSet = null;
let ssl = false;
const url = process.env.MONGO_URI;
// TODO: This will likely need to be changed based on your setup.
let database = 'database';
let user= '';
let password= '';
switch ( process.env.NODE_ENV ) {
  case 'development':
    replicaSet = null;
    break;
  case 'test':
    database = '_test';
    replicaSet = null;
    break;
  case 'staging':
    replicaSet = 'staging-shard-0';
    ssl = true;
    break;
  case 'production':
    database="macos";
    replicaSet = 'production-shard-0';
    ssl = true;
    user= 'macos';
    password= 'abcd1234';
    break;
}

module.exports.datastores = {
  // You must define env vars for the following Mongo values in a .env file or similar.
  default: {
    adapter: 'sails-mongo',
    authSource: 'admin',
    database,
    replicaSet,
    user, 
    password,
    ssl,
    host: 'localhost',
    port: '27017',
  }
};
