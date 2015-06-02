var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var L = console.log;
var q = require('q');
var models = mongoose.models;

var Item = new Schema({
    name: {
        type: String,
        required: true
    },
    labs: ['Lab']
});

mongoose.model('Item', Item);

require('./fullLabModel');
require('./labModel');
require('./itemModel');


exports.loadlab = function (req, res) {

    var deferred = q.defer();

    models.Item
        .find({
            name: req.query.item,
            'labs.name': req.query.lab
        })
        .exec(function (err, resItem) {
            if (!resItem) {
                var err404 = new Error();
                err404.name = "noItem404";
                deferred.reject(err404);
            } else if (!err) {

                var labId = 0;

                for (var i in resItem[0].labs) {
                    if (resItem[0].labs[i].name == req.query.lab) {
                        labId = resItem[0].labs[i].labId;
                    }
                }

                models.FullLab
                    .find({
                        _id: labId
                    })
                    .exec(function (err, resLab) {
                        if (!resItem) {
                            var err404 = new Error();
                            err404.name = "noLab404";
                            deferred.reject(err404);
                        } else if (!err) {
                            deferred.resolve(resLab[0]);
                        } else {
                            var err500 = new Error();
                            err500.name = "noLab500";
                            deferred.reject(err500);
                        }
                    })
            } else {
                var err500 = new Error();
                err500.name = "noItem500";
                deferred.reject(err500);
            }
        })

    return deferred.promise;
}

exports.data = function () {
    var deferred = q.defer();

    models.Item
        .find()
        .exec(function (err, resItem) {
            if (!resItem) {
                var err404 = new Error();
                err404.name = "noItem404";
                deferred.reject(err404);
            } else if (!err) {
                deferred.resolve(resItem);
            } else {
                var err500 = new Error();
                err500.name = "noItem500";
                deferred.reject(err500);
            }
        })

    return deferred.promise;
}





