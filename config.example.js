//To use this config on Heroku, remember to setup config.js then run flattenconfig.js to setup Heroku 
//env params based on this config file. e.g "node flattenconfig.js ./config.js | sh " will push flat obj from
//config.js keys into heroku as config paramaters. This way your config.js can be git excluded.
module.exports = {
    // Used by express.cookieParser
    // Just make up some random string. SHA1 hash works well.
    sessionSecret: '891e0b202e6df9236e464bfff1cf1e1fad7b82fb',
    // The port at which the server runs
    port: 3000,

    // local comments database
    db: {
        user: "",
        password: "",
        database: "comments",
        host: "localhost"
    },

    // Use local database also for authentication
    auth: {
        type: "local",
        register: "http://example.com/register"
    },
    // ALTERNATIVE: Authenticate using Sencha Forum database
    // auth: {
    //     type: "sencha_forum",
    //     register: "http://www.sencha.com/forum/register.php",
    //     db: {
    //         user: "",
    //         password: "",
    //         host: "",
    //         database: ""
    //     }
    // },

    // The database to run jasmine unit tests in
    testDb: {
        user: "",
        password: "",
        database: "comments_test",
        host: "localhost"
    },

    email: {
        domain: "docs.sencha.com",
        // Config for nodemailer. Defaults to SMTP transport. 
        // If using SES, then add in config.AWSSecretKey and config.AWSAccessKeyID
        // See https://github.com/andris9/Nodemailer and http://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-domains.html
        // mode: "SES", => Uncomment to use Amazon SES. 
        config: {
            host: 'localhost',
            port: 25,
            //AWSAccessKeyID: "YOUR_AWS_ACCESS_KEY_ID", //=> If mode==SES, then set this.
            //AWSSecretKey: "YOUR_AWS_ACCESS_KEY_SECRET", //=> If mode==SES then set this.
            //ServiceUrl: "https://email.us-east-1.amazonaws.com", //=> If mode=SES then set this.
        }
        // An address where to send all e-mails about new comments.
        // mailinglists: "comments@example.com"
    }

};
