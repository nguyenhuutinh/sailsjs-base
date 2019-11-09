/**
 * Production environment settings
 * (sails.config.*)
 *
 * What you see below is a quick outline of the built-in settings you need
 * to configure your Sails app for production.  The configuration in this file
 * is only used in your production environment, i.e. when you lift your app using:
 *
 * ```
 * NODE_ENV=production node app
 * ```
 *
 * > If you're using git as a version control solution for your Sails app,
 * > this file WILL BE COMMITTED to your repository by default, unless you add
 * > it to your .gitignore file.  If your repository will be publicly viewable,
 * > don't add private/sensitive data (like API secrets / db passwords) to this file!
 *
 * For more best practices and tips, see:
 * https://sailsjs.com/docs/concepts/deployment
 */

module.exports = {
  blueprints: {
    shortcuts: false
  },
  port: 1337,
  ssl: undefined,
  custom: {
    baseUrl: 'http://vps264672.vps.ovh.ca',
    internalEmailAddress: 'support@example.com'
  },
  datastores: {
    default: {
      // ssl: true,
    }
  },
  http: {
    cache: 365.25 * 24 * 60 * 60 * 1000, // One year
    trustProxy: true,
  },
  log: {
    level: 'debug'
  },
  models: {
    migrate: 'safe' // cascadeOnDestroy: false,
  },
  security: {
    cors: {
      allowOrigins: [
        'http://vps264672.vps.ovh.ca',
      ]
    }
  },
  session: {
    cookie: {
      secure: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  },
  sockets: {  onlyAllowOrigins: ["http://vps264672.vps.ovh.ca", "http://fullmacapp.com"]}
};
