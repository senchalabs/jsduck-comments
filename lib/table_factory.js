var DbFacade = require('./db_facade');
var Comments = require('./comments');
var Users = require('./users');
var Subscriptions = require('./subscriptions');
var ForumAuth = require('./forum_auth');
var LocalAuth = require('./local_auth');
var ConnectionPool = require('./connection_pool');
var config = require('../config');

/**
 * Produces instances of classes representing different tables.  Each
 * instance is factored only once and a cached instance is returned on
 * subsequent calls.
 *
 * @constructor
 * Initializes factory to work within a specific comments domain.
 * @param {String} domain
 */
function TableFactory(domain) {
    this.domain = domain;
}

TableFactory.prototype = {
    /**
     * Returns Comments instance.
     * @return {Comments}
     */
    comments: function() {
        return this.cache("comments", function() {
            return new Comments(this.database(), this.domain);
        });
    },

    /**
     * Returns Users instance.
     * @return {Users}
     */
    users: function() {
        return this.cache("users", function() {
            return new Users(this.database(), this.auth());
        });
    },

    /**
     * Returns Subscriptions instance.
     * @return {Subscriptions}
     */
    subscriptions: function() {
        return this.cache("subscriptions", function() {
            return new Subscriptions(this.database(), this.domain);
        });
    },

    auth: function() {
        if (config.auth.type === "sencha_forum") {
            var db = new DbFacade(ConnectionPool.get("users", config.auth.db));
            return new ForumAuth(db);
        }
        else if (config.auth.type === "local") {
            return new LocalAuth(this.database());
        }
        else {
            throw "Unknown auth type in config file: " + config.auth.type;
        }
    },

    database: function() {
        return this.cache("database", function() {
            var connection = ConnectionPool.get("comments", config.db);
            return new DbFacade(connection);
        });
    },

    cache: function(name, fn) {
        var key = "__" + name;
        if (!this[key]) {
            this[key] = fn.call(this);
        }
        return this[key];
    }
};

module.exports = TableFactory;
