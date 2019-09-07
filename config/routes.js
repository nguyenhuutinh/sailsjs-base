/* eslint sort-keys: 0 */
/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  // Auth Routes
  'post /auth/signup': 'AuthController.signup',
  'post /auth/signin': 'AuthController.signin',
  'get /auth/sendMagicLink': 'AuthController.sendMagicLink',

  // User Routes
  'get /user': 'UserController.getSelf',
  'patch /user': 'UserController.update',
  'get /user/:id': 'UserController.findOne',
  'patch /user/:id': 'UserController.update',
  'delete /user/:id': 'UserController.destroy',

  // Ping Route
  'get /ping': 'PingController.ping'
};
