// admin:set-password – reset a player's Zauberwort with the Firebase Admin SDK [AUTH-11].
// Usage: npm run admin:set-password -- <username> <new-password>
// Needs .secrets/service-account.json (never committed).
import fs from 'node:fs';
import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { usernameToEmail } from '../src/services/username';

const KEY_FILE = '.secrets/service-account.json';
const [username, password] = process.argv.slice(2);

if (!username || !password) {
  console.error('Usage: npm run admin:set-password -- <username> <new-password>');
  process.exit(1);
}
if (password.length < 6) {
  console.error('The Zauberwort needs at least 6 characters.');
  process.exit(1);
}
if (!fs.existsSync(KEY_FILE)) {
  console.error(`Missing ${KEY_FILE}. See README → Firebase setup, step 5.`);
  process.exit(1);
}

initializeApp({ credential: cert(JSON.parse(fs.readFileSync(KEY_FILE, 'utf8'))) });
const auth = getAuth();
const user = await auth.getUserByEmail(usernameToEmail(username));
await auth.updateUser(user.uid, { password });
// Keep it where the admin console can show it again (DECISIONS.md #76).
await getFirestore().doc(`secrets/${user.uid}`).set({ password });
console.log(`Zauberwort for "${username}" (${user.uid}) updated and stored.`);
