import ldap from 'ldapjs';
import config from 'config';
import { Logger } from '../logger/ld_logger';

export function connectLdap(): ldap.Client {
  return ldap.createClient({
    url: 'ldap://' + config.get('ldaphostname') + ':389/',
  });
}

export function disConnect(client: ldap.Client): void {
  client.unbind(err => {
    Logger.infolog('ldapunbind error' + err);
  });
}
