var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var L = console.log;
var q = require('q');
var models = mongoose.models;

var GraphicLab2 = new Schema({
    str: {
        type: String
    }
});

var GraphicLab3 = new Schema({
    link: {
        type: String
    }
});

mongoose.model('GraphicLab2', GraphicLab2);
mongoose.model('GraphicLab3', GraphicLab3);


exports.graphicLab2 = function () {
    var deferred = q.defer();

    models.GraphicLab2.find().exec(function(err, strings) {

        if (err) {
            deferred.reject(err);
        }
        else {
            deferred.resolve(strings);
        }

    });
    return deferred.promise;
}


exports.graphicLab3 = function () {
    var deferred = q.defer();

    models.GraphicLab3.find().exec(function(err, links) {

        if (err) {
            deferred.reject(err);
        }
        else {
            deferred.resolve(links);
        }

    });
    return deferred.promise;
}