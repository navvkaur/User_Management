const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt=require("bcrypt")
const ActivityLogsSchema = new Schema({
    Module_name:{
        type: String
    },
    Activity_name:{
        type:String
    },
    UserId:{
        type: mongoose.Schema.Types.ObjectId,    
    },
    data:{
        type : Object
    },
    Role:{
        type:String
    },
    timestamps: {} });

    ActivityLogsSchema.set('timestamps', true); // this will add createdAt and updatedAt timestamps

const ActivityLogs = mongoose.model('activitylogs',ActivityLogsSchema);
module.exports = ActivityLogs;