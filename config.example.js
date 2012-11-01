
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
        type: "local"
    },
    // ALTERNATIVE: Authenticate using Sencha Forum database
    // auth: {
    //     type: "sencha_forum",
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

    // Config for nodemailer
    // See https://github.com/andris9/Nodemailer
    email: {
        from: "Sencha Documentation <no-reply@sencha.com>",
        config: {
            host: 'localhost',
            port: 25
        }
    }
};
