/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  '*': ['isAuthenticated'],
  AuthController: {
    '*': true
  },
  PostController: {
    '*': true,
    'create': 'isAuthenticated',
    'uploadFeature': 'isAuthenticated'
  },
  PingController: {
    '*': true
  }
};
