import natural from 'natural';
import { MailAddress } from './db_mailaddress';
import { RegistValue } from '../regist_value';
import { SearchMailAddress } from '../if_search_mailAddress';

export class DBSearchMailAddress implements SearchMailAddress {
  searchSimilarAddress(email: string): Promise<Array<RegistValue>> {
    const sngn = email.split('@');

    const sngnsplits = sngn[0].split('_');
    const serachOpt: Array<object> = [];

    if (sngnsplits.length > 1) {
      serachOpt.push({ metaP_surName: natural.Metaphone.process(sngnsplits[0]) });
      serachOpt.push({ metaP_givenName: natural.Metaphone.process(sngnsplits[1]) });
    } else {
      serachOpt.push({ metaP_surName: natural.Metaphone.process(sngnsplits[0]) });
    }

    return new Promise((resolve, reject) => {
      MailAddress.find({ $or: serachOpt }, (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var resultArray: Array<RegistValue> = [];
          for (var index in res) {
            resultArray.push(
              new RegistValue(res[index].get('name'), res[index].get('mailAddress'), res[index].get('department'))
            );
          }
          resolve(resultArray);
        }
      });
    });
  }

  searchDepartmentName(email: string): Promise<Array<RegistValue>> {
    return new Promise((resolve, reject) => {
      MailAddress.find({ mailAddress: { $regex: email, $options: 'i' } }, (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          var resultArray: Array<RegistValue> = [];
          for (var index in res) {
            resultArray.push(
              new RegistValue(res[index].get('name'), res[index].get('mailAddress'), res[index].get('department'))
            );
          }
          resolve(resultArray);
        }
      });
    });
  }
}
