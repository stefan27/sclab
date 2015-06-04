var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var L = console.log;

var d = new Date();
var y1 = d.getFullYear();
var m1 = d.getMonth();
var d1 = d.getDate();
var h1 = d.getHours();
var min1 = d.getMinutes();

var FullLab = new Schema({
    nameItem: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    topic: {
        type: String
    },
    task: {
        type: String
    },
    content: {
        type: String
    },
    dateCreate: {
        type: Date,
        default: new Date(y1, m1, d1, h1, min1)
    },
    dateBegin: {
        type: Date,
        default: new Date(y1, m1, d1, h1, min1-1)

    },
    dateEnd: {
        type: Date,
        default: new Date(y1, m1, d1, h1, min1+1)
    }
});

mongoose.model('FullLab', FullLab);
