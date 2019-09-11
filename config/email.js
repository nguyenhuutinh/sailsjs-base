// TODO: Edit the necessary fields.
module.exports.email = {
  from: 'Your Name <no-reply@yourapp.com>',
  provider: process.env.EMAIL_PROVIDER || 'SendgridProvider',
  secret: process.env.EMAIL_SECRET
};
