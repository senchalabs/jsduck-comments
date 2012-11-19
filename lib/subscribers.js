var ReplyDetector = require("./reply_detector");

/**
 * Determines the users who should receive a notification about the
 * posting of this comment.
 *
 * @constructor
 * Creates new Subscribers instance.
 * @param {Object} cfg Config object:
 * @param {TableFactory} cfg.db Access to database tables.
 * @param {Object} cfg.comment The new comment that was posted.
 */
function Subscribers(cfg) {
    this.db = cfg.db;
    this.comment = cfg.comment;
}

Subscribers.prototype = {
    /**
     * This single public method will grab all the users to be notified.
     * @param {Function} callback
     * @param {Error} callback.err
     * @param {Object[]} callback.users
     */
    get: function(callback) {
        this.sequence([
            this.getSubscribers,
            this.getReplyReceivers,
            this.getDirectReplyReceivers,
            this.getPreviousCommenters
        ], callback);
    },

    // invokes all the subscribers queries in sequence.
    // merging together the list of users, eliminating any duplicates.
    sequence: function(callbacks, next) {
        var allUsers = [];

        var run = function() {
            var fn = callbacks.shift();
            if (fn) {
                fn.call(this, function(err, users) {
                    if (err) {
                        next(err);
                    }
                    else {
                        allUsers = this.merge(allUsers, users);
                        run();
                    }
                }.bind(this));
            }
            else {
                next(null, this.excludeUserWithId(allUsers, this.comment.user_id));
            }
        }.bind(this);

        run();
    },

    // gives all users who have explicitly subscribed to a thread
    getSubscribers: function(callback) {
        this.db.subscriptions().findUsersByTarget(this.comment.target_id, callback);
    },

    // gives users who were referred to in this comment using "@username" syntax.
    getReplyReceivers: function(callback) {
        this.db.subscriptions().findImplicitSubscribersByTarget(this.comment.target_id, function(err, users) {
            if (err) {
                callback(err);
                return;
            }
            var otherUsers = this.excludeUserWithId(users, this.comment.user_id);
            callback(null, ReplyDetector.detect(this.comment.content, otherUsers));
        }.bind(this));
    },

    // gives user who's comment was directly replied to.
    getDirectReplyReceivers: function(callback) {
        if (this.comment.parent_id) {
            this.db.subscriptions().findCommentAuthors(this.comment.parent_id, callback);
        }
        else {
            callback([]);
        }
    },

    // Gives the author of the previous comment.
    // It's likely that the comment was posted as a reply to the
    // previous comment in thread, so we notify the author of that.
    getPreviousCommenters: function(callback) {
        var target_id = this.comment.target_id;
        var parent_id = this.comment.parent_id;
        this.db.subscriptions().findPreviousAuthorInThread(target_id, parent_id, callback);
    },

    merge: function(target, source) {
        var userMap = {};

        target.forEach(function(user) {
            if (!userMap[user.id]) {
                userMap[user.id] = user;
            }
        });

        source.forEach(function(user) {
            if (!userMap[user.id]) {
                userMap[user.id] = user;
                target.push(user);
            }
        });

        return target;
    },

    excludeUserWithId: function(users, user_id) {
        return users.filter(function(u){ return u.id !== user_id; });
    }
};

module.exports = Subscribers;
