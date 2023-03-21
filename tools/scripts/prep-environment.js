const fs = require('fs');
const path = require('path');

require('dotenv').config({
  path: path.resolve(`${__dirname}../../../.env`)
});

const action$ = new Promise((resolve, error) => 
  
  // Copy loaded env file (from Google Secret manager) to the build before deploying.
  fs.copyFile(`apps/kujali-functions/src/functions/.env.${process.env.GOOGLE_PROJECT_ID}-secret`, 
              `dist/apps/kujali-functions/.env`,     
  (err) => { if (err) error(err);
             else (resolve()); }));

action$.then(() => console.log('Secret environment loaded!'));
       //.error(e => { console.log('Environment couldnt load!'); throw e; });
