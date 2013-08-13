/*Build config as you would - in config.js. This is to run locally or on a standalone setup.
Then flatten config hash into a single hierarchy object to build config to use for Heroku (optional)
If you have initialized a Heroku app, use this script to generate a series of heroku config:set commands
to push the config to heroku and not have to push the config.js to it or your SCM
Run "node flattenconfig.js | sh" to do this.
*/
var flatten=require('flat').flatten;
whichfile=process.argv[2];

function isEmptyObject(obj) {
    for(var prop in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                  return false;
                      }
            }
      return true;
}

try{
  var config = require(whichfile);
  if (isEmptyObject(config) ) { 
    throw("Oops! Expected "+whichfile+" to return an object with props."); 
  }

  var flatconfig=flatten(config);
  var str="";
  for(var thiskey in flatconfig){
   str+=(thiskey + "=" + flatconfig[thiskey] + ' ') ;
  }
  console.log("#If you intend to run this app on Heroku, initialize an app and run the following to import config into Heroku.");
  console.log("heroku config:set "+str);     
}
catch(err){
  process.stderr.write("Supplied "+whichfile+" needs to return a simple object! => "+err.message);   
}

