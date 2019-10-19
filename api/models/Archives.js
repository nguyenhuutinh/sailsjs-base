/**
 * Archive.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    
    time: {
      type: 'string',
      // defaultsTo: '匿名用户',
      unique: true,
      required: true
    },
    posts: {
      collection: 'posts',
      via: 'archive'
    },

  },

};

