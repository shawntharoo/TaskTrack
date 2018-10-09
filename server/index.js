require('dotenv').config();
require('dotenv').load();
var cors = require('cors');
var con = require('./db');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
const MySQLStore = require('express-mysql-session')(expressSession);
var config = require('./config.js');

var app = express();
var server = require('http').Server(app);

if (!config.API_KEY) {
    console.log("Please set your ACCOUNT_SECURITY_API_KEY environment variable before proceeding.");
    process.exit(1);
}


const options = {
    checkExpirationInterval: 1000 * 60 * 15,// 15 min // How frequently expired sessions will be cleared; milliseconds.
    expiration: 1000 * 60 * 60 * 24 * 7,// 1 week // The maximum age of a valid session; milliseconds.
    createDatabaseTable: true,// Whether or not to create the sessions database table, if one does not already exist.
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};

const sessionStore = new MySQLStore(options,con);

con.connect(function(err){
    if(err) {
        throw err;
    } else {
        console.log("Connected!");
        app.use(expressSession({
            secret: config.SECRET,
            cookie: { secure: false },
            store: sessionStore,
            resave: false,
            saveUninitialized: false
        }));
        var port = config.PORT || 5151;
        server.listen(port);
        console.log("Magic happening on port " + port);
    }
});


app.use(cookieParser());
app.use(
    expressSession(
        {
            'secret': config.SECRET,
            resave: true,
            saveUninitialized: true
        }
    )
);
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({
    extended: true
}));


var router = express.Router();

var users = require('./controllers/users.js');
var tasks = require('./controllers/tasks.js');
var groups = require('./controllers/groups');
var discussions = require('./controllers/discussion');

/**
 * Task Activities
 */
router.route('/task/addTask').post(tasks.addtask);
router.route('/task/allTasks').get(tasks.alltasks);
router.route('/task/tasksOfUser').post(tasks.taskOfUser);
router.route('/task/getOneTask').post(tasks.getTaskDetails);
router.route('/task/updateTask').post(tasks.updateTask);
router.route('/task/taskAssignedToUser').post(tasks.taskAssignedToUser);
router.route('/task/taskAssignedByUser').post(tasks.taskAssignedByUser);
router.route('/task/sendNotification').post(tasks.sendNotification);
router.route('/task/markComplete').post(tasks.markComplete);
router.route('/task/markActive').post(tasks.markActive);
router.route('/task/addSelfTask').post(tasks.addSelfTask);
router.route('/task/deleteTask').post(tasks.deleteTask);
router.route('/task/delete_UpdateTask').post(tasks.deleteAndUpdateTask);

/**
 * User Activities
 */
router.route('/accountsecurity/start').post(users.requestPhoneVerification);
router.route('/accountsecurity/verifyPhoneToken').post(users.verifyPhoneToken);
router.route('/users/sendSMS').post(users.sendSMS);
router.route('/users/allusers').get(users.allUsers);
router.route('/users/addplayerid').post(users.addPlayerId);
router.route('/users/getUserDetails').post(users.getUserDetails);
router.route('/users/getWatchUsers').post(users.watchUsers);
router.route('/users/getOtherUsers').post(users.otherUsers);
router.route('/users/addToWatchListUser').post(users.addToWatchList);
router.route('/users/removeFromWatchListUser').post(users.removeFromWatchList);
router.route('/users/addUser').post(users.addUser);
router.route('/users/addPlayer').post(users.addPlayer);
router.route('/users/getPlayer').post(users.getPlayer);
router.route('/users/assignedByMe').post(users.assignedByMe);
router.route('/users/notInWatch').post(users.NotinWatchList);

/**
 * Group Activities
 */
router.route('/groups/allGroups').get(groups.allGroups);
router.route('/groups/taskOfGroup').post(groups.taskOfGroup);
router.route('/groups/addGroup').post(groups.addGroup);
router.route('/groups/deleteGroup').post(groups.deleteGroup);

/**
 * Discussion Activities
 */
router.route('/discussion/watchDiscussions').post(discussions.watchDiscussions);
router.route('/discussion/otherDiscussions').post(discussions.otherDiscussions);
router.route('/discussion/addDiscussion').post(discussions.addDiscussions);
router.route('/discussion/addToWatchListDiscussion').post(discussions.addToWatchList);
router.route('/discussion/removeFromWatchListDiscussion').post(discussions.removeFromWatchList);
router.route('/discussion/addMessages').post(discussions.addMessages);
router.route('/discussion/getMessages').post(discussions.getMessages);


/**
 * Test for 200 response.  Useful when setting up Twilio callback.
 */
router.route('/test').get(function (req, res) {
    return res.status(200).send({ "connected": true });
});


/**
 * Prefix all router calls with 'api'
 */
app.use('/api', router);
// app.use('/', express.static(__dirname + '/public'));
app.use('/app', express.static(__dirname + '/myApp'));
