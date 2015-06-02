var express = require('express');
var session = require('express-session');
var path = require('path');
var log = require('./lib/log')(module);
var q = require('q');
var bodyParser = require('body-parser');
var url = require("url");
var config = require('./lib/config');
var favicon = require('serve-favicon');

var mongoose = require('mongoose');
var models = mongoose.models;

app = express();

port = process.argv[2] || 8000;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(favicon(__dirname + '/static/favicon.ico'));


// ROUTES
// =============================================================================
function checkPath(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var pathname = url_parts.pathname;
    next();
    //res.redirect('/Auth/LoginPage');
}

app.use(express.static(path.join(__dirname, "../front/style")));

app.use("*/Customers/*", checkPath);

app.use("*/Personals/*", checkPath);

app.use("*/Scheds/*", checkPath);

app.use("*/Roles/*", checkPath);

app.use("*/Commands/*", checkPath);

app.use("*/MyAccount/", checkPath);

app.use(express.static(path.join(__dirname, "../front/")));

/*app.post("/Accounts/Login", passport.authenticate('local'), function(req, res) {
    var url = "./";
    switch (req.user.role) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            //url = url + "Views/Admin/index.html";
            res.redirect("/");
            break;
        default:
            url = url + "Views/Auth/LoginPage.html";
            res.sendfile(url);
            break;

    }
});*/


function start(route, handle) {
    function onRequest(request, response) {
        //var pathname = url.parse(request.url).pathname;
        var url_parts = url.parse(request.url, true);
        var pathname = url_parts.pathname;
        console.log("Request for " + pathname + " received.");
        route(handle, pathname, request, response);
    }

    app.use(onRequest);

    mongoose.connect(config.get('mongoose:uri'));
    var db = mongoose.connection;

    db.on('error', function(err) {
        log.error('connection error:', err.message);
    });

    db.once('open', function callback() {

        models.Item.find(function(err, resItem) {
            if (!resItem.length) {
                require('./createDb');
            } else {
                log.info('Start Database');
            }
        });
    });

    app.listen(config.get('port'), function() {
        log.info('Express server listening on port ' + config.get('port'));
    });

}


_MenuLabItems = [{
    "Description": "Main",
    "Route": "#/Main/Main",
    "Module": "applicationModule"
}, {
    "Description": "Numeric",
    "buttonDescription": "Numeric",
    "dropDownMmenu1": "Lab1",
    "RouteMenu1": "#/Numeric/Lab1",
    "dropDownMmenu2": "Lab2",
    "RouteMenu2": "#/Numeric/Lab2",
    "Module": "labModule"
}, {
    "Description": "Cluster",
    "buttonDescription": "Cluster",
    "dropDownMmenu1": "Lab2",
    "RouteMenu1": "#/Cluster/Lab2",
    "dropDownMmenu2": "Lab3",
    "RouteMenu2": "#/Cluster/Lab3",
    "Module": "labModule"
}, {
    "Description": "Graphics",
    "buttonDescription": "Graphics",
    "dropDownMmenu1": "Lab1",
    "RouteMenu1": "#/Graphics/Lab1",
    "dropDownMmenu2": "Lab2",
    "RouteMenu2": "#/Graphics/Lab2",
    "Module": "labModule"
}];


exports.start = start;
