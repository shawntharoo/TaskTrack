var con = require('../db');

/**
 * @param req
 * @param res
 */
exports.allGroups = function (req, res) {
    var selectGroupsSql = "SELECT * FROM groups";
    con.query(selectGroupsSql, function (err, rows, fields) {
        if (err) 
        res.status(500).json(err);

        res.status(200).json(rows);
    });
}

/**
 * @param req
 * @param res
 */
exports.taskOfGroup = function (req, res) {
    var grpId = req.body.groupId;
    var selectGroupsSql = "SELECT * FROM tasks where groupId = '"+grpId+"'";
    con.query(selectGroupsSql, function (err, rows, fields) {
        if (err) 
        res.status(500).json(err);

        res.status(200).json(rows);
    });
}

/**
 * @param req
 * @param res
 */
exports.addGroup = function (req, res) {
    var grpTitle = req.body.title;
    var grpDescription = req.body.description;
    var selectGroupsSql = "INSERT INTO groups (title, description) VALUES ('"+grpTitle+"', '"+grpDescription+"')";
    con.query(selectGroupsSql, function (err, rows, fields) {
        if (err) 
        res.status(500).json(err);

        res.status(200).json(rows);
    });
}

/**
 * @param req
 * @param res
 */
exports.deleteGroup = function (req, res) {
    var grpId = req.body.grpId;
    var updateGroup = "UPDATE tasks SET groupId = 1 WHERE groupId = "+grpId+"";
    console.log(updateGroup)
    con.query(updateGroup, function (err, rows) {
        if (err) 
            throw err;

        var deleteGroup= "DELETE FROM groups where idgroup = " + grpId + "";
        console.log(deleteGroup)
        con.query(deleteGroup, function (err, result) {
            if (err)
                throw err;

            res.status(200).json(result);
        });
    });
}