var config = require('../config.js');
var con = require('../db');
var phoneReg = require('../lib/phone_verification')(config.API_KEY);
var client = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

/**
 * Register a phone
 *
 * @param req
 * @param res
 */
exports.sendSMS = function (req, res) {
    var phone_number = req.body.phoneNumber;
    var phone = "+" + phone_number;
    var message = req.body.message;
    client.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
        body: message
    }).then((message) => console.log(message.sid));


};

/**
 * Register a phone
 *
 * @param req
 * @param res
 */
exports.requestPhoneVerification = function (req, res) {
    var phone_number = req.body.phone_number;
    var country_code = req.body.country_code;
    var via = 'sms';

    console.log("body: ", req.body);

    if (phone_number && country_code && via) {
        phoneReg.requestPhoneVerification(phone_number, country_code, via, function (err, response) {
            if (err) {
                console.log('error creating phone reg request', err);
                res.status(500).json(err);
            } else {
                console.log('Success register phone API call: ', response);
                res.status(200).json(response);
            }
        });
    } else {
        console.log('Failed in Register Phone API Call', req.body);
        res.status(500).json({ message: "Fields are missing" });
    }

};

/**
 * Confirm a phone registration token
 *
 * @param req
 * @param res
 */
exports.verifyPhoneToken = function (req, res) {
    var country_code = req.body.country_code;
    var phone_number = req.body.phone_number;
    var token = req.body.token;
    var firstname = req.body.firstname;
    if (phone_number && country_code && token) {
        phoneReg.verifyPhoneToken(phone_number, country_code, token, function (err, response) {
            if (err) {
                console.log('error creating phone reg request', err);
                res.status(500).json(err);
            } else {
                console.log('Confirm phone success confirming code: ', response);
                if (response.success) {

                    con.query("SELECT * FROM users WHERE phone_number = '" + country_code + phone_number + "'", function (err, rows) {
                        if (err) throw err;
                        if (rows.length == 0) {
                            var newUser = new Object();
                            newUser.phone_number = country_code + phone_number;
                            newUser.country_code = country_code;
                            newUser.firstname = firstname;
                            var insertUserQuery = "INSERT INTO users ( phone_number, country_code, firstname ) values ('" + newUser.phone_number + "','" + newUser.country_code + "','" + newUser.firstname + "')";
                            console.log(insertUserQuery);
                            con.query(insertUserQuery, function (err, rows) {
                                if (err) throw err;
                                res.status(200).json(rows[0])
                            });
                        } else {
                            var updateUserQuery = "UPDATE users SET country_code = '" + country_code + "', firstname = '" + firstname + "' WHERE phone_number ='" + country_code + phone_number + "'";
                            con.query(updateUserQuery, function (err, rows) {
                                if (err) throw err;
                                res.status(200).json(rows.affectedRows);
                            });
                        }
                    });
                } else {
                    res.status(200).json(response);
                }
            }
        });
    } else {
        console.log('Failed in Confirm Phone request body: ', req.body);
        res.status(500).json({ message: "Missing fields" });
    }
};

/**
 * All users
 *
 * @param req
 * @param res
 */
exports.allUsers = function (req, res) {
    con.query("SELECT * FROM users", function (err, result, fields) {
        if (err) res.status(500).json(err);

        res.status(200).json(result);
      });
};

/**
 * Add player ids for OneSignal notifications
 *
 * @param req
 * @param res
 */

exports.addPlayerId = function (req, res) {
    var phone_number = req.body.phone_number;
    var player_id = req.body.player_id;
    console.log(req.body)
    User.findOne({ phone_number: phone_number }).exec(function (err, usr) {
        if (!usr.player_ids.includes(player_id)) {
            User.update(
                { phone_number: phone_number },
                { $push: { player_ids: player_id } }
            ).exec(function (err, usr) {
                if (err) {
                    res.status(500).json({ 'error': 'error adding player id' })
                } else {
                    res.status(200).json(usr);
                    console.log(usr)
                }
            })
            // User.player_ids.push(player_id)
            // User.save(done)
        } else {
            res.status(200).json({ 'message': 'player id exists' })
        }
    })
}

/**
* Get user details
*
* @param req
* @param res
*/
exports.getUserDetails = function (req, res) {
    var phone_number = req.body.phone_number;

    User.findOne({ phone_number: phone_number }).exec(function (err, usr) {
        if (!err) {
            res.status(200).json(usr)
        } else {
            res.status(500).json(err)
        }
    })
}

/**
 * get watch users
 * 
 * @param req
 * @param res
 */
exports.watchUsers = function (req, res) {
    var phone_number = req.body.phone_number;
    var selectWatchUserSql = "SELECT * FROM(SELECT * FROM userWatching WHERE watcher = '"+phone_number+"') as userWatching INNER JOIN users user ON userWatching.watching = user.phone_number";
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
exports.otherUsers = function (req, res) {
    var phoneNumbers = req.body.numbers;
    var selectWatchUserSql = "SELECT * from users where phone_number NOT IN ("+phoneNumbers.join()+")";
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
exports.NotinWatchList = function (req, res) {
    var phoneNumber = req.body.phone_number;
    var selectWatchUserSql = "SELECT * FROM(SELECT * FROM userWatching WHERE watcher = '"+phoneNumber+"') as userWatching RIGHT JOIN users user ON userWatching.watching = user.phone_number WHERE userWatching.iduserWatching IS NULL AND phone_number <> '"+phoneNumber+"'";
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
exports.assignedByMe = function (req, res) {
    var phone_number = req.body.phone_number;
    var selectWatchUserSql = "SELECT assigned_to,assigned_name from tasks where assigned_by = '"+phone_number+"' AND assigned_to <> '"+phone_number+"' GROUP BY assigned_to";
    con.query(selectWatchUserSql, function (err, rows, fields) {
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

    con.query("SELECT * FROM userWatching WHERE watcher = '" + watcher + "' AND watching = '"+watching+"'", function (err, rows) {
        if (err) throw err;
        if (rows.length == 0) {
            var selectWatchUserSql = "INSERT INTO userWatching( watching, watcher ) values ('" + watching + "','" + watcher + "')";
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

    con.query("SELECT * FROM userWatching WHERE watcher = '" + watcher + "' AND watching = '"+watching+"'", function (err, rows) {
        if (err) throw err;
        if (rows.length > 0) {
            var selectWatchUserSql = "DELETE FROM userWatching WHERE watcher = '" + watcher + "' AND watching = '"+watching+"'";
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
exports.addUser = function (req, res) {
    var country_code = req.body.country_code;
    var phone_number = req.body.phone_number;
    var firstname = req.body.firstname;

    con.query("SELECT * FROM users WHERE phone_number = '" + phone_number + "'", function (err, rows) {
        if (err) throw err;
        if (rows.length == 0) {
            var newUser = new Object();
            newUser.phone_number = phone_number;
            newUser.country_code = country_code;
            newUser.firstname = firstname;
            var insertUserQuery = "INSERT INTO users ( phone_number, country_code, firstname ) values ('" + newUser.phone_number + "','" + newUser.country_code + "','" + newUser.firstname + "')";
            con.query(insertUserQuery, function (err, rows) {
                if (err) throw err;
                res.status(200).json(rows[0])
            });
        } else {
            res.status(200).json({message : "user already exist"});
        }
    });
}

/**
 * add to watch list
 * 
 * @param req
 * @param res
 */
exports.addPlayer = function (req, res) {
    var phone_number = req.body.phone_number;
    var player_id = req.body.player_id;

    con.query("SELECT * FROM onesignal_player WHERE user = '" + phone_number + "' AND player_id = '"+ player_id +"'", function (err, rows) {
        if (err) throw err;
        if (rows.length == 0) {
            var insertUserQuery = "INSERT INTO onesignal_player ( user, player_id ) values ('" + phone_number + "','" + player_id + "')";
            con.query(insertUserQuery, function (err, rows) {
                if (err) throw err;
                res.status(200).json(rows)
            });
        } else {
            res.status(200).json({message : "user already exist"});
        }
    });
}

/**
 * add to watch list
 * 
 * @param req
 * @param res
 */
exports.getPlayer = function (req, res) {
    var phone_number = req.body.phone_number;

    con.query("SELECT * FROM onesignal_player WHERE user = '" + phone_number + "'", function (err, rows) {
        if (err) throw err;

        res.status(200).json(rows)
    });
}

