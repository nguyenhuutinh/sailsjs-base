# sailsjs-base

This is a base SailJS API application that is already setup for basic JWT authentication through Passport. All necessary models, routes, controllers, and helpers are installed and ready to go. This API assumes a local MongoDB instance running but can be changed in `config/datastores.js` to whatever DB you use.

# Getting configured

1. Clone the repo and run `npm install`.
2. Edit the necessary variables/default text at the top in `config/passport.js`.
3. If you want Mail services, edit the `api/services/MailerService.js` and the `config/email.js` with the necessary info for your app and provider. A default provider of SendGrid is included but others can easily be added. You might also want to update user account creation/login emails in `api/controller/AuthController`.
4.

# Login and Account Creation

Login is based on a magic link and not a password. This can be easily changed in the `api/controller/AuthController` if desired.
