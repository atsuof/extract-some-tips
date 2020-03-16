import { connectDB, disConnectDB } from '../db/connect_mongoose';
import { MailAddress } from '../db/db_mailaddress';
import natural from 'natural';
import { fromLdap } from './from_ldap';

async function rw() {
  await connectDB();
  await MailAddress.remove({}).exec();
  var datalist = await fromLdap();
  if (datalist == undefined) {
    return;
  }
  var insertdata = [];
  for (var data of datalist) {
    if (data.value != null && data.value.indexOf('@') != -1) {
      const fullAddress = data.value.split('@');
      const sngn = fullAddress[0].split('_');
      if (fullAddress.length > 1) {
        insertdata.push({
          name: data.name,
          mailAddress: data.value,
          metaP_surName: natural.Metaphone.process(sngn[0]),
          metaP_givenName: natural.Metaphone.process(sngn[1]),
          department: data.department,
        });
      } else {
        insertdata.push({
          name: data.name,
          mailAddress: data.value,
          metaP_surName: natural.Metaphone.process(sngn[0]),
          metaP_givenName: '',
          department: data.department,
        });
      }
    }
  }
  await MailAddress.insertMany(insertdata);
  console.log('Multipule document inserted');
  disConnectDB();
  process.exit(0);
}

rw();
