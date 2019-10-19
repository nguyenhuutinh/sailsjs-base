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
  'post /api/auth/signup': 'AuthController.signup',
  'post /api/auth/signin': 'AuthController.signin',
  'post /api/auth/logout': 'AuthController.logout',

  // User Routes
  'get /api/user/me': 'UserController.getSelf',
  'patch /api/user': 'UserController.update',
  'get /api/user/:id': 'UserController.findOne',
  'patch /api/user/:id': 'UserController.update',
  'delete /api/user/:id': 'UserController.destroy',

  // Posts
  'get /api/posts': 'PostController.list',
  'post /api/post': 'PostController.create',
  'put /api/post/:id': 'PostController.update',
  'post /api/post/:id/icon': 'PostController.uploadAppIcon',
  'get /api/post/:id/icon': 'PostController.getAppIcon',
  'post /api/post/:id/screenshot': 'PostController.uploadAppScreenshot',
  'get /api/images/*': 'PostController.getAppScreenshot',
  'get /api/post': 'PostController.get',
  'get /api/post/:id': 'PostController.get',
  'delete /api/post/:id': 'PostController.delete',
  // Category
  'get /api/categories': 'CategoryController.list',
  'post /api/category': 'CategoryController.create',

  'post /api/category/:id/screenshot': 'CategoryController.uploadCatScreenshot',
  
  'put /api/category/:id': 'CategoryController.update',
  'get /api/category/:id': 'CategoryController.get',
  'delete /api/category/:id': 'CategoryController.delete',
  // Ping Route
  'get /api/ping': 'PingController.ping'
};
