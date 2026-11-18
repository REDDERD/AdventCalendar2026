// [SEC-2] The Firebase web config is public by design; security comes from firestore.rules.
export const firebaseConfig = {
  apiKey: 'AIzaSyAid_DSu-2uoqyIVLmX8UvAphD0jtISm8c',
  authDomain: 'adventskalender2026-50657.firebaseapp.com',
  projectId: 'adventskalender2026-50657',
  storageBucket: 'adventskalender2026-50657.firebasestorage.app',
  messagingSenderId: '946067471323',
  appId: '1:946067471323:web:6acc1c6078171a600ec5fe',
};

// [AUTH-12] UID of the admin account created by hand in the Firebase console.
// Must match firestore.rules. Set both with `npm run admin:set-uid -- <uid>`.
export const ADMIN_UID = 'ObgMRpvygJdMKKbabQHZuvho7992';
export const ADMIN_USERNAME = 'daniel';
export const ADMIN_NAME = 'Daniel';

// [AUTH-1] Reserved domain; no mail is ever sent.
export const EMAIL_DOMAIN = 'hogwarts.example.com';

// import.meta.env and the build constants are absent when Node scripts import this file.
export const USE_EMULATOR = import.meta.env?.VITE_FIREBASE_EMULATOR === 'true';

export const APP_VERSION: string = typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : 'dev';
export const BUILD_DATE: string = typeof __BUILD_DATE__ === 'string' ? __BUILD_DATE__ : '';
