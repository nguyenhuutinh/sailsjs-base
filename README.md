# sailsjs-base

This is a base SailsJS API application that is already setup for basic JWT authentication through Passport. All necessary models, routes, controllers, and helpers are installed and ready to go. This API assumes a local MongoDB instance running but can be changed in `config/datastores.js` to whatever DB you use.

The goal of this project is to have a quick and ready to go authentication-enabled and pre-configured API. Probably the biggest "catch" with this project is that by default, it uses magic links emailed to the user and not the standard email/password login method. However, this can be changed as directed below.

# Getting configured

1. Clone the repo and run `npm install`.
2. Edit the necessary variables/default text at the top in `config/passport.js`.
3. If you want Mail services, edit the `api/services/MailerService.js` and the `config/email.js` with the necessary info for your app and provider. A default provider of SendGrid is included but others can easily be added. You might also want to update user account creation/login emails in `api/controller/AuthController`.
4. It is suggested you use a plugin like TODOHighlighter or similar to find any `// TODO:` entries and modify as necessary.
5. Running `npm run dev` will get you going locally.

# Environment variables that need ot be configured

There are a number of Sails config variable that use local environment variables. It is suggested that you use something like .env files or set your different environments up correctly with the following variables (note: most of these have working defaults):

- EMAIL_SECRET (the secret/API key for your email provider)
- EMAIL_PROVIDER (this defaults to 'SendgridProvider' but can be changed to match any filename found in `api/services/EmailProviders`)
- API_URL (the URL of the current API)
- FE_URL (the URL of the current frontend application)
- PASSPORT_TOKENSECRET (secret token passport uses to encrypt your JWT)
- PASSPORT_ISSUER (passport issuer)
- PASSPORT_AUDIENCE (passport audience)

# Login and Account Creation

Login is based on a magic link and not a password. This can be easily changed in the `api/controller/AuthController` if desired. An important note here is that the `sendMagicLink` endpoint sends a link that points a frontend application which, in theory, will forward that request to the API to verify/login and handle the response token/user. Of course, this FE application must be built by you!

## Signup

POST: /auth/signup

Payload:

```json
{
  "email": "users@email.com",
  "username": "testuser"
}
```

Response: 200 - New user object with sensitive fields removed.

## Send Magic Link

GET: /auth/sendMagicLink/

Params: `?e={emailAddress}`

Response: 200 - Email with one-time login link is sent to the user.

## Signin

POST: /auth/signin

Payload:

```json
{
  "email": "users@email.com",
  "password": "${link sent by magic link email}"
}
```

Response: 200 - JSON object containing user and token.

# Testing

Tests can be run with `npm run test` and are setup to cover any `*.spec.js` files in the `test/controllers` directory. Presently, there are only tests written for controllers.
