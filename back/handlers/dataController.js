var log = require('./../lib/log')(module);
var mongoose = require('mongoose');

var L = console.log;
var itemModel = require('../models/itemModel');


exports.loadlab = function (req, res) {

    L('Load lab');

    itemModel.loadlab(req, res).then(function (resLab) {

            res.send({
                status: 'OK',
                resLab: JSON.stringify(resLab),
                ReturnMessage: 'Lab was found'
            });
        },
        function (err) {
            if (err.name === 'noItem404') {
                log.info("Items not found");
                req.statusCode = 404;
                res.send({
                    ReturnMessage: 'Items not found'
                });
            } else if (err.name === 'noItems500') {
                log.info("Items not found(500)");
                req.statusCode = 500;
                res.send({
                    ReturnMessage: 'Items not found(500)'
                });
            } else if (err.name === 'noLab404') {
                log.info("Lab not found");
                req.statusCode = 404;
                res.send({
                    ReturnMessage: 'Lab not found'
                });
            } else if (err.name === 'noLab500') {
                log.info("Lab not found(500)");
                req.statusCode = 500;
                res.send({
                    ReturnMessage: 'L:ab not found(500)'
                });
            } else {
                log.info("Unknown Error(500)");
                req.statusCode = 500;
                res.send({
                    ReturnMessage: 'Unknown Error(500)'
                });
            }
        }
    )
}


exports.data = function (req, res) {

    L('get Data');

    itemModel.data().then(function (data) {

            res.send({
                status: 'OK',
                data: JSON.stringify(data),
                ReturnMessage: 'Data was found'
            });
        },
        function (err) {
            if (err.name === 'noItem404') {
                log.info("Items not found");
                req.statusCode = 404;
                res.send({
                    ReturnMessage: 'Items not found'
                });
            } else if (err.name === 'noItems500') {
                log.info("Items not found(500)");
                req.statusCode = 500;
                res.send({
                    ReturnMessage: 'Items not found(500)'
                });
            } else {
                log.info("Unknown Error(500)");
                req.statusCode = 500;
                res.send({
                    ReturnMessage: 'Unknown Error(500)'
                });
            }

        }
    )
}



