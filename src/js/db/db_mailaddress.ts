import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const MailAddressSchema = new mongoose.Schema({
  name: String,
  mailAddress: String,
  metaP_surName: String,
  metaP_givenName: String,
  department: String,
});

export const MailAddress = mongoose.connection.model('mailAddress', MailAddressSchema);
