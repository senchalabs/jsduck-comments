var crypto = require('crypto');

/**
 * Authentication in local database
 */
function LocalAuth(db) {
    this.db = db;
}

LocalAuth.prototype = {
    /**
     * Attempts login with provided credentials.
     * @param {String} username
     * @param {String} password
     * @param {Function} callback Called when done.
     * @param {String} callback.err Error message when login failed.
     * @param {Object} callback.user The user that was logged in.
     */
    login: function(username, password, callback) {
        var sql = [
            "SELECT id, username, password, salt, email, moderator",
            "FROM user_auths",
            "WHERE username = ?"
        ];

        this.db.queryOne(sql, [username], function(err, user) {
            if (err) {
                callback(err);
                return;
            }

            if (!user) {
                callback("No such user");
                return;
            }

            if (!this.checkPassword(password, user.salt, user.password)) {
                callback("Invalid password");
                return;
            }

            callback(null, {
                username: user.username,
                external_id: user.id,
                email: user.email,
                moderator: !!user.moderator
            });
        }.bind(this));
    },

    checkPassword: function(password, salt, saltedPassword) {
        password = crypto.createHash('md5').update(password).digest("hex") + salt;
        password = crypto.createHash('md5').update(password).digest("hex");

        return password == saltedPassword;
    }
};

module.exports = LocalAuth;
