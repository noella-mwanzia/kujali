const packageJson = require('../../package.json'); // Take root package.json
const fs = require('fs');

const deps = packageJson['firebase-functions-dependencies'];
const buildTools =  packageJson["firebase-functions-build"];

const buildDeps = deps.concat(buildTools);

// Template of package.json for Firebase Functions
const firebaseFunctionsPackageJson = {
  engines: { node: '14' },

  name: "kujali-functions",
  version: packageJson['version'],
  license: packageJson['license'],
  main:    packageJson['main'],
  scripts: packageJson['scripts'],

  // filter only dependencies we need for Firebase Functions
  dependencies: buildDeps.reduce((acc, cur) => {
    acc[cur] = packageJson.dependencies[cur];
    return acc;
  }, {})
};

// Only for demo purpose:
console.log(
  'Firebase Functions package.json:\n',
  JSON.stringify(firebaseFunctionsPackageJson, null, 2)
);

const path = 'package.json'; // Where to save generated package.json file

fs.writeFileSync(path, JSON.stringify(firebaseFunctionsPackageJson), { flag: 'w' });
console.log(`${path} written successfully.`);
