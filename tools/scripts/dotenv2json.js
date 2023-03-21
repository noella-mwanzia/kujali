const path = require('path')
const fs = require('fs');
const file  = require(path.resolve(`${__dirname}/../../apps/kujali/src/environments/version.const.ts`));
// Get APP_VERSION from version file
const APP_VERSION = file.version;

require('dotenv').config({
  path: path.resolve(`${__dirname}../../../apps/kujali-functions/src/functions/.env.${process.env.GOOGLE_PROJECT_ID}-secret`),
});

/**
 * Creates a .ts file from a .env file.
 */
function createJSONStructureFromDotenvFile()
{
const targetPath = `${__dirname}/../../apps/kujali/src/environments/environment.ts`;

const envConfigFile = `export const environment = {
  production: ${process.env.PRODUCTION},
  application: '${process.env.APPLICATION}',
  useEmulators: ${process.env.USE_EMULATORS},

  firebase: {
    apiKey: '${process.env.FIREBASE_API_KEY}',
    authDomain: '${process.env.FIREBASE_AUTH_DOMAIN}',
    // databaseURL: '${process.env.FIREBASE_DATABASE_URL}',
    projectId: '${process.env.FIREBASE_PROJECT_ID}',
    storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${process.env.FIREBASE_MESSAGE_SENDER_ID}',
    appId: '${process.env.FIREBASE_APP_ID}',
    measurementId: '${process.env.FIREBASE_MEASUREMENT_ID}'
  },

  appVersion: '${APP_VERSION}'
};`;

  writeFile(targetPath, envConfigFile);
}

function writeFile(targetPath, envConfigFile) 
{
  fs.writeFile(targetPath, envConfigFile, 
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`environment.ts file has been created at ${path.resolve(targetPath)}`);
      }
    });
}

createJSONStructureFromDotenvFile();
