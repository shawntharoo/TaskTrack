export class Constants {
    public static URL_SERVICE_ENDPOINT: string = 'http://54.149.85.163:1340/api/';
    // public static URL_SERVICE_ENDPOINT: string = 'http://192.168.8.114:1337/api/';

    public static URL_REGISTER: string = Constants.URL_SERVICE_ENDPOINT + 'accountsecurity/start';
    public static URL_VERIFY: string = Constants.URL_SERVICE_ENDPOINT + 'accountsecurity/verifyPhoneToken';

    public static URL_ADD_PLAYERID: string = Constants.URL_SERVICE_ENDPOINT+'users/addplayerid';
    public static URL_GET_PLAYERID:string = Constants.URL_SERVICE_ENDPOINT+'users/getUserDetails';
    public static URL_SENDSMS: string = Constants.URL_SERVICE_ENDPOINT + 'users/sendSMS';
    public static URL_GET_WATCHUSERS: string = Constants.URL_SERVICE_ENDPOINT + 'users/getWatchUsers';
    public static URL_GET_OTHERUSERS: string = Constants.URL_SERVICE_ENDPOINT + 'users/getOtherUsers';
    public static URL_GET_ALLUSERS: string = Constants.URL_SERVICE_ENDPOINT + 'users/allusers';
    public static URL_ADDTO_WATCHLIST_USER: string = Constants.URL_SERVICE_ENDPOINT + 'users/addToWatchListUser';
    public static URL_REMOVE_WATCHLIST_USER: string = Constants.URL_SERVICE_ENDPOINT + 'users/removeFromWatchListUser';
    public static URL_ADDUSER: string = Constants.URL_SERVICE_ENDPOINT + 'users/addUser';
    public static URL_ADDPLAYER: string = Constants.URL_SERVICE_ENDPOINT + 'users/addPlayer';
    public static URL_GETPLAYER: string = Constants.URL_SERVICE_ENDPOINT + 'users/getPlayer';
    public static URL_ASSIGNED_BY_ME: string = Constants.URL_SERVICE_ENDPOINT + 'users/assignedByMe';
    public static URL_GET_NOTINWATCH: string = Constants.URL_SERVICE_ENDPOINT + 'users/notInWatch';
    public static URL_GET_ALLWATCHUSERS: string = Constants.URL_SERVICE_ENDPOINT + 'users/allWatchUsers';

    public static URL_ADDTASK: string = Constants.URL_SERVICE_ENDPOINT + 'task/addTask';
    public static URL_ADDSELFTASK: string = Constants.URL_SERVICE_ENDPOINT + 'task/addSelfTask';
    public static URL_UPCOMMINGTASK: string = Constants.URL_SERVICE_ENDPOINT + 'task/upcomingTasks';
    public static URL_TASKOFUSER: string = Constants.URL_SERVICE_ENDPOINT + 'task/tasksOfUser';
    public static URL_CHANGESTATUS: string = Constants.URL_SERVICE_ENDPOINT + 'task/changeTaskStatus';
    public static URL_DELETETASK: string = Constants.URL_SERVICE_ENDPOINT + 'task/deleteTask';
    public static URL_UPDATETASK: string = Constants.URL_SERVICE_ENDPOINT + 'task/updateTask';
    public static URL_GET_ONE_TASK: string = Constants.URL_SERVICE_ENDPOINT + 'task/getOneTask';
    public static URL_TASK_ASSIGNEDTO_USER: string = Constants.URL_SERVICE_ENDPOINT + 'task/taskAssignedToUser';
    public static URL_TASK_ASSIGNEDBY_USER: string = Constants.URL_SERVICE_ENDPOINT + 'task/taskAssignedByUser';
    public static URL_SENDNOTIFICATION: string = Constants.URL_SERVICE_ENDPOINT + 'task/sendNotification';
    public static URL_MARK_COMPLETE: string = Constants.URL_SERVICE_ENDPOINT + 'task/markComplete';
    public static URL_MARK_ACTIVE: string = Constants.URL_SERVICE_ENDPOINT + 'task/markActive';
    public static URL_DELETE_ASSIGN_TASK: string = Constants.URL_SERVICE_ENDPOINT + 'task/delete_UpdateTask';
    public static URL_ALL_TASKS: string = Constants.URL_SERVICE_ENDPOINT + 'task/allTasks';

    public static URL_TASKOFGROUP : string = Constants.URL_SERVICE_ENDPOINT + 'groups/taskOfGroup';
    public static URL_GET_ALLGROUPS: string = Constants.URL_SERVICE_ENDPOINT + 'groups/allGroups';
    public static URL_ADD_GROUP: string = Constants.URL_SERVICE_ENDPOINT + 'groups/addGroup';
    public static URL_DELETE_GROUP: string = Constants.URL_SERVICE_ENDPOINT + 'groups/deleteGroup';

    public static URL_GET_WATCHDISCUSSIONS: string = Constants.URL_SERVICE_ENDPOINT + 'discussion/watchDiscussions';
    public static URL_GET_OTHERDISCUSSIONS: string = Constants.URL_SERVICE_ENDPOINT + 'discussion/otherDiscussions';
    public static URL_ADDDISCUSSION: string = Constants.URL_SERVICE_ENDPOINT + 'discussion/addDiscussion';
    public static URL_ADDTO_WATCHLIST_DISCUSSION: string = Constants.URL_SERVICE_ENDPOINT + 'discussion/addToWatchListDiscussion';
    public static URL_REMOVE_WATCHLIST_DISCUSSION: string = Constants.URL_SERVICE_ENDPOINT + 'discussion/removeFromWatchListDiscussion';
    public static URL_ADDMESSAGE: string = Constants.URL_SERVICE_ENDPOINT + 'discussion/addMessages';
    public static URL_GETMESSAGE: string = Constants.URL_SERVICE_ENDPOINT + 'discussion/getMessages';

    public static URL_GET_ALLONESIGNALS: string = Constants.URL_SERVICE_ENDPOINT + 'onesignal/allOneSignals';
  }
  