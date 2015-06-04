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
    fullName: {
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
        .find()
        .exec(function (err, resItem) {
            if (!resItem) {
                var err404 = new Error();
                err404.name = "noItem404";
                deferred.reject(err404);
            } else if (!err) {


                var labId = 0;

                for (var i = 0; i < resItem.length; i++) {
                    if (resItem[i].name == req.query.item) {
                        for (var j = 0; j < resItem[i].labs.length; j++) {
                            if (resItem[i].labs[j].name == req.query.lab) {
                                labId = resItem[i].labs[j].labId;
                            }
                        }
                        resItem = resItem[i];
                        break;
                    }
                }

                models.FullLab
                    .find({
                        _id: labId
                    })
                    .exec(function (err, resLab) {
                        if (!resLab) {
                            var err404 = new Error();
                            err404.name = "noLab404";
                            deferred.reject(err404);
                        } else if (!err) {
                            deferred.resolve({ l:resLab[0], i: resItem});
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





