
module.exports = {
    sessionSecret: 'blahblahblah',
    port: 3000,

    // local comments database
    mysql: {
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
    email: {
        from: "Sencha Documentation <no-reply@sencha.com>",
        config: {
            host: 'localhost',
            port: 25
        }
    }
};
