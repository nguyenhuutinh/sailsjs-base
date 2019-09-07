/**
 * User
 * @description :: Model for storing users
 */
/* globals CipherService, User */
module.exports = {
  attributes: {
    address: {
      defaultsTo: {
        city: '',
        postalCode: '',
        state: ''
      },
      type: 'json'
    },
    email: {
      isEmail: true,
      type: 'string'
    },
    firstName: {
      defaultsTo: '',
      type: 'string'
    },
    isEnabled: {
      defaultsTo: true,
      type: 'boolean'
    },
    isSuperAdmin: {
      defaultsTo: false,
      type: 'boolean'
    },
    lastName: {
      defaultsTo: '',
      type: 'string'
    },
    password: {
      defaultsTo: '',
      required: false,
      type: 'string'
    },
    settings: {
      defaultsTo: {},
      type: 'json'
    },
    username: {
      defaultsTo: '',
      required: false,
      type: 'string'
    },
    verificationHash: {
      defaultsTo: '',
      required: false,
      type: 'string'
    }
  },
  beforeCreate: function ( values, next ) {
    if ( !values.password ) {
      values.password = CipherService.createRandomID();
    }

    CipherService.hashPassword( values );

    values = _.omit( values, this.omissions );
    next();
  },

  /**
   * Hooks
   */
  beforeUpdate: function ( values, next ) {
    CipherService.hashPassword( values );

    values = _.omit( values, this.omissions );
    next();
  },
  customToJSON: function () {
    return _.omit( this, this.omissions );
  },

  /**
   * These are the fields that will be removed on create and/or update.
   * Should be used with _.omit();
   * @type {Array}
   */
  omissions: ['isSuperAdmin', 'password', 'verificationHash'],
  schema: true
};
