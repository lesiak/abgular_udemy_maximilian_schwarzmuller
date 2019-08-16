const fs = require('fs');

// Configure Angular `environment.ts` file path
const environmentsDir = './src/environments/';
const debugEnvFile = 'environment.ts';
const prodEnvFile = 'environment.prod.ts';
// Load node modules
const colors = require('colors');
require('dotenv').load();

// `environment.ts` file structure
const envConfigFile = `export const environment = {
   webshopBaseUrl: '${process.env.UDEMY_WEBSHOP_API_BASE_URL}',
   apiKey: '${process.env.UDEMY_WEBSHOP_AUTH_API_KEY}',
   production: false
};
`;
const envConfigFileProd = `export const environment = {
   webshopBaseUrl: '${process.env.UDEMY_WEBSHOP_API_BASE_URL}',
   apiKey: '${process.env.UDEMY_WEBSHOP_AUTH_API_KEY}',
   production: true
};
`;

function writeEnvironmentFile(dir: string, fileName: string, contents: string) {
  const path = dir + fileName;
  console.log(colors.magenta(`The file \`${path}\` will be written with the following content: \n`));
  console.log(colors.grey(contents));
  fs.writeFile(path, contents, err => {
    if (err) {
      throw console.error(err);
    } else {
      console.log(colors.magenta(`Angular ${fileName} file generated correctly at ${path} \n`));
    }
  });
}

if (!fs.existsSync(environmentsDir)) {
  fs.mkdirSync(environmentsDir);
}
writeEnvironmentFile(environmentsDir, debugEnvFile, envConfigFile);
writeEnvironmentFile(environmentsDir, prodEnvFile, envConfigFileProd);
