import ldap from 'ldapjs';
import assert from 'assert';
import { Logger } from '../logger/ld_logger';
import { RegistValue } from '../regist_value';
import { connectLdap } from './connect_ldap';
import { SearchMailAddress } from '../if_search_mailAddress';

export class LdapSearchMailAddress implements SearchMailAddress {
  searchSimilarAddress(email: string): Promise<Array<RegistValue>> {
    let searchFilter = '';

    const sngn = email.split('@');
    if (sngn.length > 1) {
      let sngnlist = sngn[0].split('_');
      if (sngnlist.length > 1) {
        searchFilter = searchFilter + '(anr~=' + sngnlist[0] + ')' + '(anr~=' + sngnlist[1] + ')';
      } else {
        searchFilter = searchFilter + '(anr~=' + sngnlist[0] + ')';
      }
    }
    searchFilter = '(|' + searchFilter + ')';
    return this.search(searchFilter, 'sub', ['cn', 'mail', 'department']);
  }

  searchDepartmentName(email: string): Promise<Array<RegistValue>> {
    let searchFilter = '(|' + '(mail=' + email + ')' + ')';
    return this.search(searchFilter, 'sub', ['cn', 'mail', 'department']);
  }

  search(searchFilter: string, scopeCondition: string, attributeConditions: string[]): Promise<Array<RegistValue>> {
    let client: ldap.Client = connectLdap();
    var opts = {
      filter: searchFilter,
      scope: scopeCondition,
      attributes: attributeConditions,
    };
    return new Promise((resolve, reject) => {
      var resultArray: Array<RegistValue> = [];
      client.search('DC=ad,DC=sample,DC=co,DC=jp', opts, function(err, res) {
        assert.ifError(err);
        res.on('searchEntry', function(entry) {
          Logger.debug('entry: ' + JSON.stringify(entry.object));
          resultArray.push(new RegistValue(entry.object.cn, entry.object.mail, entry.object.department));
        });
        res.on('searchReference', function(referral) {
          Logger.debug('referral: ' + referral.uris.join());
        });
        res.on('error', function(err) {
          Logger.error('error: ' + err.message);
          reject('error: ' + err.message);
        });
        res.on('end', function(result) {
          if (result != null) {
            Logger.infolog('status: ' + result.status);
            resolve(resultArray);
          }
        });
      });
    });
  }
}
