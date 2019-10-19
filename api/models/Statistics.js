/**
 * Statistics.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true,
      unique: true
    },
    totalVisitCounts: {
      type: 'number',
      defaultsTo: 0
    },
    todayVisitCounts: {
      type: 'number',
      defaultsTo: 0
    },
    todayVisitIps: {
      type: 'json', columnType: 'array',
      defaultsTo: []
    },
    key: {
      type: 'number',
      defaultsTo: 0
    }

  },

};

