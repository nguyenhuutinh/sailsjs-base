module.exports.datastores = {
  // You must define env vars for the following Mongo values in a .env file or similar.
  default: {
    adapter: 'sails-mongo',
    authSource: 'admin',
    database: 'database',
    // TODO: This will likely need ot be changed based on your setup.
    replicaSet: process.env.NODE_ENV !== 'development' ? 'staging-shard-0' : null,
    ssl: process.env.NODE_ENV !== 'development',
    url: process.env.MONGO_URI
  }
};
