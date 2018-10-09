var userFile = require('./users');
var con = require('../db');
var qs = require('qs');
var request = require('request');

/**
 * @param req
 * @param res
 */
exports.addtask = function (req, res) {
    var assigned_by = req.body.phone_number;
    var title = req.body.formValues.title;
    var description = req.body.formValues.description;
    var status = req.body.formValues.status;
    var assigned_name = req.body.formValues.assigned_to;
    var assigned_to = req.body.assigned_to;
    var created_date = new Date();
    var group = req.body.formValues.group;

    var due_date = new Date(req.body.formValues.date);

    var taskInsertSql = "INSERT INTO tasks(assigned_by, title, description, assigned_to, groupId, status, due_date, created_date, assigned_name) VALUES ('" + assigned_by + "','" + title + "','" + description + "','" + assigned_to + "', " + group + ",'" + status + "','" + due_date + "','" + created_date + "', '"+ assigned_name +"')";
    console.log(taskInsertSql);
    con.query(taskInsertSql, function (err, result) {
        if (err)
            throw err;

        var selectUserSql = "SELECT * FROM users where phone_number = '" + assigned_to + "'";
        con.query(selectUserSql, function (err, result, fields) {
            if (err)
                throw err;

            console.log(result);
            res.status(200).json(result);
        });

    });
}

/**
 * @param req
 * @param res
 */
exports.addSelfTask = function (req, res) {
    var assigned_by = req.body.phone_number;
    var title = req.body.formValues.title;
    var description = "";
    var status = "On Track";
    var assigned_name = req.body.assigned_name;
    var assigned_to = req.body.phone_number;
    var created_date = new Date();
    var group = 1;

    var due_date = new Date();

    var taskInsertSql = "INSERT INTO tasks(assigned_by, title, description, assigned_to, groupId, status, due_date, created_date, assigned_name) VALUES ('" + assigned_by + "','" + title + "','" + description + "','" + assigned_to + "', " + group + ",'" + status + "','" + due_date + "','" + created_date + "', '"+ assigned_name +"')";
    console.log(taskInsertSql);
    con.query(taskInsertSql, function (err, result) {
        if (err)
            throw err;

        var selectUserSql = "SELECT * FROM users where phone_number = '" + assigned_to + "'";
        con.query(selectUserSql, function (err, result, fields) {
            if (err)
                throw err;

            console.log(result);
            res.status(200).json(result);
        });

    });
}


/**
 * @param req
 * @param res
 */
exports.updateTask = function (req, res) {
    var assigned_by = req.body.phone_number;
    var title = req.body.formValues.title;
    var description = req.body.formValues.description;
    var status = req.body.formValues.status;
    var assigned_name = req.body.formValues.assigned_to;
    var assigned_to = req.body.assigned_to;
    var created_date = new Date();
    var group = req.body.formValues.group;
    var task_id = req.body.task_id;
    var due_date = new Date(req.body.formValues.date);

    var taskInsertSql = "UPDATE tasks SET assigned_by = '" + assigned_by + "', title = '" + title + "', description = '" + description + "', assigned_to = '" + assigned_to + "', groupId = " + group + ", status = '" + status + "', due_date = '" + due_date + "', created_date = '" + created_date + "', assigned_name= '"+assigned_name+"' WHERE idtasks = '" + task_id + "'";
    console.log(taskInsertSql);
    con.query(taskInsertSql, function (err, result) {
        if (err)
            throw err;

        var selectUserSql = "SELECT * FROM users where phone_number = '" + assigned_to + "'";
        con.query(selectUserSql, function (err, result, fields) {
            if (err)
                throw err;

            console.log(result);
            res.status(200).json(result);
        });

    });
}


/**
 * @param req
 * @param res
 */
exports.alltasks = function (req, res) {
    var selectTasksSql = "SELECT * FROM tasks";
    con.query(selectTasksSql, function (err, rows, fields) {
        if (err)
            throw err;

        console.log(fields);
        res.status(200).json(rows);
    });
}

/**
 * @param req
 * @param res
 */
exports.taskOfUser = function (req, res) {
    var user = req.body.phone_number;
    var selectUserTaskSql = "SELECT grp.title as grpTitle, grp.description, tabl.* FROM (SELECT * FROM tasks where assigned_to = '" + user + "' or assigned_by='" + user + "') AS task INNER JOIN groups grp ON task.groupId = grp.idgroup";
    con.query(selectUserTaskSql, function (err, rows, fields) {
        if (err)
            throw err;

        res.status(200).json(rows);
    });
}

/**
 * @param req
 * @param res
 */
exports.getTaskDetails = function (req, res) {
    var taskId = req.body.taskId;
    var selectTaskDataSql = "SELECT user.firstname, grp.title as grpTitle, grp.description, tabl.* FROM (SELECT * FROM todo.tasks where idtasks = '" + taskId + "') as tabl INNER JOIN groups grp ON tabl.groupId = grp.idgroup LEFT JOIN users user ON tabl.assigned_to = user.phone_number ";
    con.query(selectTaskDataSql, function (err, rows, fields) {
        if (err)
            throw err;

        res.status(200).json(rows);
    });
}

/**
 * @param req
 * @param res
 */
exports.taskAssignedToUser = function (req, res) {
    var user = req.body.assigned_user;
    var selectTaskAssUserSql = "SELECT grp.title as grpTitle, grp.description, tasksTbl.* FROM (SELECT * FROM todo.tasks WHERE assigned_to = '"+user+"') AS tasksTbl INNER JOIN todo.users usrs ON tasksTbl.assigned_by = usrs.phone_number INNER JOIN groups grp ON tasksTbl.groupId = grp.idgroup";
    con.query(selectTaskAssUserSql, function (err, rows, fields) {
        if (err)
            throw err;

        res.status(200).json(rows);
    });
}

/**
 * @param req
 * @param res
 */
exports.taskAssignedByUser = function (req, res) {
    var user = req.body.assigned_user;
    var selectTaskAssUserSql = "SELECT grp.title as grpTitle, grp.description, tasksTbl.* FROM (SELECT * FROM todo.tasks WHERE assigned_by = '"+user+"') AS tasksTbl INNER JOIN todo.users usrs ON tasksTbl.assigned_to = usrs.phone_number INNER JOIN groups grp ON tasksTbl.groupId = grp.idgroup";
    con.query(selectTaskAssUserSql, function (err, rows, fields) {
        if (err)
            throw err;

        res.status(200).json(rows);
    });
}

/**
 * @param req
 * @param res
 */
exports.sendNotification = function (req, res) {
    var data = {
        app_id: req.body.app_id,
        contents: req.body.contents,
        include_player_ids: req.body.include_player_ids
    }
    
    // var headers = {
    //     "Content-Type": "application/json; charset=utf-8",
    //     "Authorization": "Basic NGEwMGZmMjItY2NkNy0xMWUzLTk5ZDUtMDAwYzI5NDBlNjJj"
    // };

    var headers = {
        "Content-Type": "application/json; charset=utf-8"
    };

    var options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers
    };

    var https = require('https');
    var req = https.request(options, function (res) {
        res.on('data', function (data) {
            console.log("Response:");
            console.log(JSON.parse(data));
        });
    });

    req.on('error', function (e) {
        console.log("ERROR:");
        console.log(e);
    });

    req.write(JSON.stringify(data));
    req.end();
}

/**
 * @param req
 * @param res
 */
exports.markComplete = function (req, res) {
    var taskId = req.body.taskId;
    var status = req.body.status;
    var selectTaskAssUserSql = "UPDATE tasks SET status = '" + status + "' WHERE idtasks = '" + taskId + "'";
    con.query(selectTaskAssUserSql, function (err, rows, fields) {
        if (err)
            throw err;

        res.status(200).json(rows);
    });
}

/**
 * @param req
 * @param res
 */
exports.markActive = function (req, res) {
    var taskId = req.body.taskId;
    var status = req.body.status;
    var selectTaskAssUserSql = "UPDATE tasks SET status = '" + status + "' WHERE idtasks = '" + taskId + "'";
    con.query(selectTaskAssUserSql, function (err, rows, fields) {
        if (err)
            throw err;

        res.status(200).json(rows);
    });
}

/**
 * @param req
 * @param res
 */
exports.deleteTask = function (req, res) {
    var taskId = req.body.idtasks;
    var selectTaskAssUserSql = "DELETE FROM tasks WHERE idtasks = '" + taskId + "'";
    con.query(selectTaskAssUserSql, function (err, rows, fields) {
        if (err)
            throw err;

        res.status(200).json(rows);
    });
}

/**
 * @param req
 * @param res
 */
exports.deleteAndUpdateTask = function (req, res) {
    var taskId = req.body.task.idtasks;
    var user = req.body.user;
    var selectTaskAssUserSql = "UPDATE tasks SET assigned_to = '" + user + "' WHERE idtasks = '" + taskId + "'";
    con.query(selectTaskAssUserSql, function (err, rows, fields) {
        if (err)
            throw err;

        res.status(200).json(rows);
    });
}