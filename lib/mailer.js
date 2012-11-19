var nodemailer = require("nodemailer");
var Subscribers = require("./subscribers");
var config = require("../config");

/**
 * Takes care of notifying subscribers about a new comment.
 *
 * @constructor
 * Creates a new mailer.
 * @param {Object} cfg Config object:
 * @param {TableFactory} cfg.db Access to database tables.
 * @param {Object} cfg.comment The new comment that was posted.
 * @param {String} cfg.threadUrl The URL from where the comment came from.
 */
function Mailer(cfg) {
    this.db = cfg.db;
    this.comment = cfg.comment;
    this.threadUrl = cfg.threadUrl;
}

Mailer.prototype = {
    /**
     * Sends e-mail updates about the comment to everybody who need to
     * be updated about it.  This includes:
     *
     * - users who have explicitly subscribed to the thread.
     * - users who are mentioned in the comment using @username syntax.
     * - users who's comment gets a direct reply.
     * - users who have posted the previous comment in thread.
     */
    sendEmailUpdates: function() {
        this.getUsersToBeNotified(function(err, users) {
            if (err || users.length === 0) {
                return;
            }

            this.batchSend(users.map(this.createMessage, this));
        }.bind(this));
    },

    getUsersToBeNotified: function(callback) {
        var subscribers = new Subscribers({
          db: this.db,
          comment: this.comment
        });

        subscribers.get(callback);
    },

    createMessage: function(user) {
        var title = this.createTitle();

        return {
            from: config.email.from,
            to: user.email,
            subject: "Comment on '" + title + "'",
            text: [
                "A comment by " + this.comment.username + " on '" + title + "' was posted on the Sencha Documentation:\n",
                this.comment.content + "\n",
                "--",
                "Original thread: " + this.threadUrl
            ].join("\n")
        };
    },

    createTitle: function() {
        if (this.comment.type === "class") {
            return this.comment.cls + " " + this.comment.member;
        }
        else {
            return this.comment.type + " " + this.comment.cls;
        }
    },

    batchSend: function(emails) {
        this.transport = nodemailer.createTransport("SMTP", config.email.config);

        this.send(emails, function() {
            this.transport.close();
        }.bind(this));
    },

    // Here the actual sending happens
    send: function(emails, callback) {
        var mail = emails.shift();

        if (!mail) {
            callback();
            return;
        }

        this.transport.sendMail(mail, function(err) {
            if (err) {
                console.log("Failed sending e-mail to " + mail.to);
                console.log(err);
            }
            else {
                console.log("Sent e-mail to " + mail.to);
            }

            this.send(emails, callback);
        }.bind(this));
    }
};

module.exports = Mailer;
