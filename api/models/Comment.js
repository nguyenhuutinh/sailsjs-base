/**
 * Comment.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    nickname: {
      type: 'string',
      // defaultsTo: '匿名用户',
      unique: true,
      required: true
    },
    email:'string',
    website: 'string',
    content: 'string',
    createDate: {
      type: 'string', columnType: 'datetime'
    },
    // response: {
    //   model: 'comment',
    //   collection: 'comment',
    //   via: 'response'
    // }

  },

};

