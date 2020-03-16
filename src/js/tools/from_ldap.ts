import ldap from 'ldapjs';
import assert from 'assert';
import config from 'config';
import { RegistValue } from '../regist_value';
// client.bind('cn=admin,dc=test,dc=ldap,dc=co,dc=jp', 'zaq12WSX', function(err) {
//   assert.ifError(err);
// });

export async function fromLdap(): Promise<Array<RegistValue> | undefined> {
  var client = ldap.createClient({
    url: 'ldap://' + config.get('ldaphostname') + ':389/',
  });
  let oneResult = await search('OU=ONE', client);
  let anotherResult = await search('OU=ANOTHER', client);
  client.unbind(err => {
    console.log('ldapunbind error' + err);
  });
  return oneResult.concat(anotherResult);
}

function search(OU: string, client: ldap.Client): Promise<Array<RegistValue>> {
  var opts = {
    scope: 'sub',
    attributes: ['cn', 'value', 'department'],
  };
  return new Promise((resolve, reject) => {
    const results: Array<RegistValue> = [];
    client.search(OU + ',DC=ad,DC=sample,DC=co,DC=jp', opts, function(err, res) {
      assert.ifError(err);
      res.on('searchEntry', function(entry) {
        results.push(new RegistValue(entry.object.cn, entry.object.mail, entry.object.department));
      });
      res.on('searchReference', function() {});
      res.on('error', function(err) {
        reject('error: ' + err.message);
      });
      res.on('end', function(result) {
        if (result != null) {
          resolve(results);
        }
      });
    });
  });
}
