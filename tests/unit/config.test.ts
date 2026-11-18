import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { ADMIN_UID } from '../../src/config';

describe('dependencies', () => {
  it('has exactly one @firebase/app (two copies break Firestore at runtime)', () => {
    const fromFirebase = createRequire(path.resolve('node_modules/firebase/package.json'));
    const fromFirestore = createRequire(path.resolve('node_modules/@firebase/firestore/package.json'));
    expect(fromFirestore.resolve('@firebase/app')).toBe(fromFirebase.resolve('@firebase/app'));
  });
});

describe('admin bootstrap [AUTH-12]', () => {
  it('uses the same ADMIN_UID in config.ts and firestore.rules', () => {
    const rules = fs.readFileSync('firestore.rules', 'utf8');
    const match = rules.match(/function isAdmin\(\)\s*\{ return signedIn\(\) && request\.auth\.uid == '([^']+)'/);
    expect(match?.[1]).toBe(ADMIN_UID);
  });
});
