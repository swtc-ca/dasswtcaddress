import * as applicationSettings from 'tns-core-modules/application-settings/application-settings'

const masterPasswordKey = 'MASTERPASSWORD';
const unlockedKey = "UNLOCKED";
const swtcServerKey = 'SWTCSERVER';
const swtcWalletKey = 'SWTCWALLET';

/**
 * Parent service class. Has common configs and methods.
 */
export default class BackendService {
  constructor(v) {
    console.log(`backend service ${v} initializing`)
    console.log(`backend service ${v} initialized`)
  }

  get masterPassword() {
    return applicationSettings.getString(masterPasswordKey);
  }
  set masterPassword(v) {
    applicationSettings.setString(masterPasswordKey, v);
  }

  get unlocked() {
    return applicationSettings.getBoolean(unlockedKey);
  }
  set unlocked(v) {
    applicationSettings.setBoolean(unlockedKey, v);
  }
}
