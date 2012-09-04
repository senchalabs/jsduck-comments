var crypto = require('crypto');

/**
 * @class ApiAdapter
 * Provides methods to convert between old JSON API and how things are
 * named in our MySQL database.
 */
module.exports = {
    /**
     * Turns comment row into JSON response.
     */
    commentToJson: function(comment) {
        return {
            _id: comment.id,
            author: comment.username,
            content: comment.content,
            contentHtml: comment.content_html,
            createdAt: String(comment.created_at),
            score: comment.vote,
            upVote: comment.vote_dir === 1,
            downVote: comment.vote_dir === -1,
            moderator: comment.moderator,
            emailHash: crypto.createHash('md5').update(comment.email).digest("hex")
        };
    },

    /**
     * Turns target array in JSON into {type,cls,member} object.
     */
    targetFromJson: function(target) {
        return {
            type: target[0],
            cls: target[1],
            member: target[2] || ""
        };
    },

    /**
     * Turns target object into array.
     */
    targetToJson: function(target) {
        return [
            target.type,
            target.cls,
            target.member
        ];
    }
};