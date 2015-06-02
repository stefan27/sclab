var log = require('./../lib/log')(module);
var mongoose = require('mongoose');
var fs = require('fs');

var L = console.log;
var graphicModel = require('../models/graphicModel');

exports.graphicLab2 = function (req, res) {
    L('getStrings');

    graphicModel.graphicLab2().then(function (strings) {

        res.send({
            status: 'OK',
            strings: JSON.stringify(strings),
            ReturnMessage: 'Strings was found'
        })

    }, function (err) {
        L(err);
        res.statusCode = 404;
        res.send({
            ReturnMessage: 'Strings not found'
        });
    });

}

exports.graphicLab3 = function (req, res) {
    L('getLinks');

    graphicModel.graphicLab3().then(function (links) {

        res.send({
            status: 'OK',
            links: JSON.stringify(links),
            ReturnMessage: 'Links was found'
        })

    }, function (err) {
        L(err);
        res.statusCode = 404;
        res.send({
            ReturnMessage: 'Links not found'
        });
    });

}

/*exports.sched4doctor = function(req, res) {
 scheds.sched4doctor(req, res).then(function(results) {

 res.send({
 status: 'OK',
 id: req.user._id,
 name: req.user.FIO,
 Patients: JSON.stringify(results[0]),
 Meets: JSON.stringify(results[1]),
 ReturnMessage: results[0].length + ' patients, ' +
 results[1].length + ' meets'
 })
 }).fail(
 function(err) {
 if (err.name === 'noDoctors404') {
 log.info("Doctors not found");
 req.statusCode = 404;
 res.send({
 ReturnMessage: 'Doctors not found'
 });
 } else if (err.name === 'noDoctors500') {
 log.info("Doctors not found(500)");
 req.statusCode = 500;
 res.send({
 ReturnMessage: 'Doctors not found(500)'
 });
 }
 else if (err.name === 'noPatients404') {
 log.info("Patients not found");
 req.statusCode = 404;
 res.send({
 ReturnMessage: 'Patients not found'
 });
 } else if (err.name === 'noPatients500') {
 log.info("Patients not found(500)");
 req.statusCode = 500;
 res.send({
 ReturnMessage: 'Patients not found(500)'
 });
 }
 else if (err.name === 'noMeets404') {
 log.info("Meets not found");
 req.statusCode = 404;
 res.send({
 ReturnMessage: 'Meets not found'
 });
 } else if (err.name === 'noMeets500') {
 log.info("Meets not found(500)");
 req.statusCode = 500;
 res.send({
 ReturnMessage: 'Meets not found(500)'
 });
 } else {
 log.info("Unknown Error(500)");
 req.statusCode = 500;
 res.send({
 ReturnMessage: 'Unknown Error(500)'
 });
 }

 })

 }


 exports.create = function(req, res) {
 scheds.create(req.body).then(
 function(results) {
 log.info("Meets created");
 res.send({
 status: 'OK',
 Meets: JSON.stringify(results),
 ReturnMessage: 'Meets created'
 });
 }).fail(
 function(err) {

 if (err.name === "noDoctor404") {
 log.info("Doctor not found");
 req.statusCode = 404;
 res.send({
 ReturnMessage: 'Doctor not found'
 });
 } else if (err.name === "400") {
 log.info("Doctor Valid Error");
 req.statusCode = 400;
 res.send({
 ReturnMessage: 'Doctor Valid Error'
 });
 } else if (err.name === "noSave400") {
 log.info("Meet Valid Error");
 req.statusCode = 400;
 res.send({
 ReturnMessage: 'Meet Valid Error'
 });
 } else if(err.name === "500") {
 log.error('Internal error(%d): %s', req.statusCode, err.name);
 req.statusCode = 500;
 res.send({
 ReturnMessage: 'Server Error(500)'
 });
 } else {
 log.info("Unknown Error(500)");
 req.statusCode = 500;
 res.send({
 ReturnMessage: 'Unknown Error(500)'
 });
 }
 });
 }

 exports.getMeetsById = function(req, res) {
 scheds.getMeetsById(req, res).then(
 function(meets) {
 log.info(meets.length + ' Meets');
 res.send({
 status: 'OK',
 Meets: JSON.stringify(meets),
 ReturnMessage: meets.length + ' Meets'
 });
 }).fail(
 function(err) {
 if (err.name === 'noDoctor404') {
 log.error('Doctor not found');
 req.statusCode = 404;
 res.send({
 ReturnMessage: 'Doctor not found'
 });
 }
 else if (err.name === 'noMeets404') {
 log.error('Meets not found');
 req.statusCode = 404;
 res.send({
 ReturnMessage: 'Meets not found'
 });
 }
 else if (err.name === 'noDoctor500') {
 log.error('Doctor not found(500)');
 req.statusCode = 500;
 res.send({
 ReturnMessage: 'Doctor not found(500)'
 });
 }
 else if (err.name === 'noMeets500') {
 log.error('Meets not found(500)');
 req.statusCode = 500;
 res.send({
 ReturnMessage: 'Meets not found(500)'
 });
 } else {
 log.info("Unknown Error(500)");
 req.statusCode = 500;
 res.send({
 ReturnMessage: 'Unknown Error(500)'
 });
 }

 })
 }


 exports.update = function(req, res) {

 scheds.update(req.body).then(
 function() {
 log.info("Meets updated");
 res.send({
 status: 'OK',
 ReturnMessage: 'Meets updated'
 });
 }).fail(
 function(err) {
 if (err.name == '400') {
 log.error('Validation error');
 req.statusCode = 400;
 res.send({
 ReturnMessage: 'Validation error'
 });
 } else if (err.name == '404') {
 log.error('Meet not found');
 req.statusCode = 404;
 res.send({
 ReturnMessage: 'Meet not found'
 });
 } else if (err.name == '500') {
 log.error('Not found Meet(500)');
 req.statusCode = 500;
 res.send({
 ReturnMessage: 'Meet Not found(500)'
 });
 } else {
 log.info("Unknown Error(500)");
 req.statusCode = 500;
 res.send({
 ReturnMessage: 'Unknown Error(500)'
 });
 }
 });
 }


 exports.remove = function(req, res) {
 L('delete');
 scheds.remove(req, res).then(function() {
 log.info("meet removed");
 res.send({
 status: 'OK',
 ReturnMessage: 'Meet deleted'
 });
 }).fail(function(err) {
 if (err.name === "404") {
 req.statusCode = 404;
 res.send({
 ReturnMessage: 'Meet not found'
 });
 } else if (err.name === 400) {
 req.statusCode = 400;
 res.send({
 ReturnMessage: 'Validation error'
 });
 } else if (err.name === 500) {
 req.statusCode = 500;
 res.send({
 ReturnMessage: 'Meet not found(500)'
 });
 } else {
 log.info("Unknown Error(500)");
 req.statusCode = 500;
 res.send({
 ReturnMessage: 'Unknown Error(500)'
 });
 }
 });
 }
 */