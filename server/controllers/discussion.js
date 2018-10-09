var con = require('../db');

/**
 * @param req
 * @param res
 */
exports.allDiscussions = function (req, res) {
    var selectGroupsSql = "SELECT * FROM discussions";
    con.query(selectGroupsSql, function (err, rows, fields) {
        if (err) 
        res.status(500).json(err);

        res.status(200).json(rows);
    });
}

/**
 * get watch users
 * 
 * @param req
 * @param res
 */
exports.watchDiscussions = function (req, res) {
    var phone_number = req.body.phone_number;
    var selectWatchUserSql = "SELECT * FROM(SELECT * FROM discussionWatching WHERE watcher = '"+phone_number+"') as disWatching INNER JOIN discussions discuss ON disWatching.watching = discuss.idDiscussion";
    con.query(selectWatchUserSql, function (err, rows, fields) {
        if (!err) {
            res.status(200).json(rows)
        } else {
            res.status(500).json(err)
        }
    });
}

/**
 * get other users
 * 
 * @param req
 * @param res
 */
exports.otherDiscussionsExceptWatch = function (req, res) {
    var phone_number = req.body.phone_number;
    var discussion_ids = req.body.discussion_ids;
    var selectOtherUserSql = "SELECT * FROM(SELECT * FROM discussionWatching WHERE watcher NOT IN ('"+phone_number+"')) as disWatching INNER JOIN discussions discuss ON disWatching.watching = discuss.idDiscussion WHERE idDiscussion NOT IN("+discussion_ids.join()+")";
    console.log(selectOtherUserSql)
    con.query(selectOtherUserSql, function (err, rows, fields) {
        if (!err) {
            res.status(200).json(rows)
        } else {
            res.status(500).json(err)
        }
    });
}

/**
 * get other users
 * 
 * @param req
 * @param res
 */
exports.otherDiscussions = function (req, res) {
    var phone_number = req.body.phone_number;
    var discussion_ids = req.body.discussion_ids;
    var selectOtherUserSql = "SELECT * FROM discussions WHERE idDiscussion NOT IN("+discussion_ids.join()+")";
    con.query(selectOtherUserSql, function (err, rows, fields) {
        if (!err) {
            res.status(200).json(rows)
        } else {
            res.status(500).json(err)
        }
    });
}

/**
 * add a discussion
 * 
 * @param req
 * @param res
 */
exports.addDiscussions = function (req, res) {
    var phone_number = req.body.phone_number;
    var title = req.body.formValues.title;
    var description = req.body.formValues.description;
    var task = req.body.formValues.task;
    var selectOtherUserSql = "INSERT INTO discussions(title, description, taskId) VALUES ('" + title + "','" + description + "', " + task + ")";
    console.log(selectOtherUserSql)
    con.query(selectOtherUserSql, function (err, rows, fields) {
        if (!err) {
            res.status(200).json(rows)
        } else {
            res.status(500).json(err)
        }
    });
}

/**
 * add to watch list
 * 
 * @param req
 * @param res
 */
exports.addToWatchList = function (req, res) {
    var watcher = req.body.watcher;
    var watching = req.body.watching;

    con.query("SELECT * FROM discussionWatching WHERE watcher = '" + watcher + "' AND watching = '"+watching+"'", function (err, rows) {
        if (err) throw err;
        if (rows.length == 0) {
            var selectWatchUserSql = "INSERT INTO discussionWatching( watching, watcher ) values ('" + watching + "','" + watcher + "')";
            con.query(selectWatchUserSql, function (err, rows, fields) {
                if (!err) {
                    res.status(200).json(rows)
                } else {
                    res.status(500).json(err)
                }
            });
        }
    });
}

/**
 * add to watch list
 * 
 * @param req
 * @param res
 */
exports.removeFromWatchList = function (req, res) {
    var watcher = req.body.watcher;
    var watching = req.body.watching;

    con.query("SELECT * FROM discussionWatching WHERE watcher = '" + watcher + "' AND watching = '"+watching+"'", function (err, rows) {
        if (err) throw err;
        if (rows.length > 0) {
            var selectWatchUserSql = "DELETE FROM discussionWatching WHERE watcher = '" + watcher + "' AND watching = '"+watching+"'";
            con.query(selectWatchUserSql, function (err, rows, fields) {
                if (!err) {
                    res.status(200).json(rows)
                } else {
                    res.status(500).json(err)
                }
            });
        }
    });
}

/**
 * get messages
 * 
 * @param req
 * @param res
 */
exports.getMessages = function (req, res) {
    var descussionId = req.body.discussionId;

    con.query("SELECT * FROM messages WHERE discussion = '" + descussionId + "'", function (err, rows) {
        if (err) throw err;

        res.status(200).json(rows)
    });
}

/**
 * get messages
 * 
 * @param req
 * @param res
 */
exports.addMessages = function (req, res) {
    var message = req.body.message;
    var sender = req.body.sender;
    var time = req.body.time;
    var discussion = req.body.discussion;

    var selectWatchUserSql = "INSERT INTO messages( message, sender, time, disussion ) values ('" + message + "','" + sender + "','" + time + "','" + discussion + "')";
    con.query(selectWatchUserSql, function (err, rows, fields) {
        if (!err) {
            res.status(200).json(rows)
        } else {
            res.status(500).json(err)
        }
    });
}

