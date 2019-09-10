let replicaSet = null;
let ssl = false;
const url = process.env.MONGO_URI;
// TODO: This will likely need to be changed based on your setup.
let database = 'database';

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
    replicaSet = 'production-shard-0';
    ssl = true;
    break;
}

module.exports.datastores = {
  // You must define env vars for the following Mongo values in a .env file or similar.
  default: {
    adapter: 'sails-mongo',
    authSource: 'admin',
    database,
    replicaSet,
    ssl,
    url
  }
};
