var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var L = console.log;
var q = require('q');
var models = mongoose.models;

var Lab = new Schema({
    name: {
       type: String
    },
    labId: {
        type: ObjectId,
        ref: 'FullLab'
    }
})

mongoose.model('Lab', Lab);

require('./fullLabModel');





