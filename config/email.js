// TODO: Edit the necessary fields.
module.exports.email = {
  from: 'Your Name <no-reply@yourapp.com>',
  provider: process.env.email_provider || 'SendgridProvider',
  secret: process.env.email_secret
};
