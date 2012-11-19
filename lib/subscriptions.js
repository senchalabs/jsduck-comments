var Targets = require("./targets");

/**
 * Represents a Subscriptions table.
 *
 * @constructor
 * Initializes Subscriptions with a database connection and a target domain.
 *
 * @param {DbFacade} db Instance of DbFacade.
 * @param {String} domain The comments domain within which to work.
 */
function Subscriptions(db, domain) {
    this.db = db;
    this.domain = domain;
    this.targets = new Targets(db, domain);
}

Subscriptions.prototype = {
    /**
     * Finds all targets a user has subscribed to.
     *
     * @param {Number} user_id ID of the user.
     * @param {Function} callback Called with the result.
     * @param {Error} callback.err The error object.
     * @param {Object[]} callback.targets An array of targets.
     */
    findTargetsByUser: function(user_id, callback) {
        var sql = [
            'SELECT targets.*',
            'FROM subscriptions JOIN targets ON subscriptions.target_id = targets.id',
            'WHERE domain = ? AND user_id = ?'
        ];

        this.db.query(sql, [this.domain, user_id], callback);
    },

    /**
     * Finds all users who have subscribed to a particular target.
     *
     * @param {Number} target_id ID of the target.
     * @param {Function} callback Called with the result.
     * @param {Error} callback.err The error object.
     * @param {Object[]} callback.users An array of users.
     */
    findUsersByTarget: function(target_id, callback) {
        var sql = [
            'SELECT users.*',
            'FROM subscriptions JOIN users ON subscriptions.user_id = users.id',
            'WHERE target_id = ?'
        ];

        this.db.query(sql, [target_id], callback);
    },

    /**
     * Gets all users who have posted to the given target.
     *
     * @param {Number} target_id ID of the target.
     * @param {Function} callback Called with the result.
     * @param {Error} callback.err The error object.
     * @param {Object[]} callback.users An array of users.
     */
    findImplicitSubscribersByTarget: function(target_id, callback) {
        var sql = [
            "SELECT DISTINCT users.*",
            "FROM visible_comments JOIN users on visible_comments.user_id = users.id",
            "WHERE target_id = ?"
        ];
        this.db.query(sql, [target_id], callback);
    },

    /**
     * Gets the user who is the author of a specific comment.
     * This method returns an array to be more like the other
     * two methods above that also return an array.
     *
     * @param {Number} comment_id ID of the comment.
     * @param {Function} callback Called with the result.
     * @param {Error} callback.err The error object.
     * @param {Object[]} callback.users An array of one user or empty array.
     */
    findCommentAuthors: function(comment_id, callback) {
        var sql = [
            "SELECT users.*",
            "FROM comments JOIN users on comments.user_id = users.id",
            "WHERE comments.id = ?"
        ];
        this.db.query(sql, [comment_id], callback);
    },

    /**
     * Gets the user who is the author of the previous comment in the
     * thread.  That is, not the author of the very latest comment,
     * but one before it.
     *
     * This method returns an array to be more like the other
     * two methods above that also return an array.
     *
     * @param {Number} target_id ID of the target.
     * @param {Number} parent_id ID of the parent comment.
     * Can be left as undefined to
     * @param {Function} callback Called with the result.
     * @param {Error} callback.err The error object.
     * @param {Object[]} callback.users An array of one user or empty array.
     */
    findPreviousAuthorInThread: function(target_id, parent_id, callback) {
        var sql = [
            "SELECT users.*",
            "FROM visible_comments as comments JOIN users on comments.user_id = users.id",
            "WHERE comments.target_id = ?",
              "AND comments.parent_id ", (parent_id ? "=" : "IS"), "?",
            "ORDER BY created_at DESC",
            "LIMIT 1 OFFSET 1"
        ];
        this.db.query(sql, [target_id, parent_id], callback);
    },

    /**
     * Adds new subscription.
     * @param {Object} subscription
     * @param {Number} subscription.user_id
     * @param {Object} subscription.target
     * @param {Function} callback
     * @param {Error} callback.err The error object.
     * @param {Number} callback.subscriptionId ID of the new subscription.
     */
    add: function(subscription, callback) {
        // First remove any existing subscriptions, then continue with
        // adding the new one.
        this.remove(subscription, function(err) {
            this.targets.ensure(subscription.target, function(err, target_id) {
                this.db.insert("subscriptions", {
                    user_id: subscription.user_id,
                    target_id: target_id
                }, callback);
            }.bind(this));
        }.bind(this));
    },

    /**
     * Removes an existing subscription.
     * @param {Object} subscription
     * @param {Number} subscription.user_id
     * @param {Object} subscription.target
     * @param {Function} callback
     * @param {Error} callback.err The error object.
     */
    remove: function(subscription, callback) {
        this.targets.ensure(subscription.target, function(err, target_id) {
            var sql = "DELETE FROM subscriptions WHERE user_id = ? AND target_id = ?";
            this.db.query(sql, [subscription.user_id, target_id], callback);
        }.bind(this));
    }
};

module.exports = Subscriptions;
