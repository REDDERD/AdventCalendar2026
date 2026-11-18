// admin:set-uid – write the admin UID into src/config.ts and firestore.rules [AUTH-12].
// Usage: npm run admin:set-uid -- <uid>
import fs from 'node:fs';

const uid = process.argv[2];
if (!uid || !/^[A-Za-z0-9_-]{6,128}$/.test(uid)) {
  console.error('Usage: npm run admin:set-uid -- <uid>');
  process.exit(1);
}

function replace(file: string, pattern: RegExp, replacement: string): void {
  const source = fs.readFileSync(file, 'utf8');
  if (!pattern.test(source)) throw new Error(`Pattern not found in ${file}`);
  fs.writeFileSync(file, source.replace(pattern, replacement));
  console.log(`Updated ${file}`);
}

replace('src/config.ts', /export const ADMIN_UID = '[^']*';/, `export const ADMIN_UID = '${uid}';`);
replace(
  'firestore.rules',
  /(function isAdmin\(\)\s*\{ return signedIn\(\) && request\.auth\.uid == )'[^']*'/,
  `$1'${uid}'`,
);
