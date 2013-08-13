/* Wraps around config.js and Heroku config (ENV) to set config.x.y as needed 
First try local config.js else fallback to Heroku envs vars. 
For Heroku config vars to be available, you should've initialized a heroku app and pushed the params to it from flattenconfig.js
*/

var unflatten = require('flat').unflatten

var config={}

function isEmptyObject(obj) {
  for(var prop in obj) {
  if (Object.prototype.hasOwnProperty.call(obj, prop)) {
    return false;
    }
  }
return true;
}

try{
  config = require('../config');
  if (isEmptyObject(config)) {
    throw "Empty config hash!";
  }
  console.log("Sourced config from config.js");
}
catch(err){
  console.log("Missing config.js, assuming I am on Heroku now!");
  //Build config from Heroku env.
  herokuconfig=process.env;
  delete herokuconfig['NODE_ENV'];
  delete herokuconfig['PATH'];
  config=unflatten(herokuconfig);
}

module.exports = config;





