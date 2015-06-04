"use strict";

define(['angularAMD', 'jquery', 'angular-route'], function (angularAMD) {
    var app = angular.module("appModule", ['ngRoute']);

    app.config(function ($httpProvider) {
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        $httpProvider.defaults.withCredentials = true;
    });

    app.config(['$routeProvider', function ($routeProvider) {

        $routeProvider
            .when("/", angularAMD.route({
                templateUrl: function (rp) {
                    return 'views/Data/Data.html';
                },
                controllerUrl: "views/Data/DataController"
            }));

        $routeProvider
            .when("/Main/Main", angularAMD.route({
                templateUrl: function (rp) {
                    return 'views/Main/Main.html';
                },
                controllerUrl: "views/Main/mainController"
            }));

        $routeProvider
            .when("/Data/Data", angularAMD.route({
                templateUrl: function (rp) {
                    return 'views/Data/Data.html';
                },
                controllerUrl: "views/Data/DataController"
            }));

        $routeProvider
            .when("/:item/:lab", angularAMD.route({

                templateUrl: function (rp) {
                    return 'views/LoadLab/LoadLab.html';
                },

                //controllerUrl: "views/LoadLab/LoadLabController"


                resolve: {

                    load: ['$q', '$rootScope', '$location',
                        function ($q, $rootScope, $location) {

                            //var path = $location.path();
                            //var parsePath = path.split("/");
                            //var parentPath = parsePath[1];
                            //var controllerName = parsePath[2];

                            //var loadController = "views/" + parentPath + "/" + controllerName + "Controller";
                            var loadController = "views/LoadLab/LoadLabController";

                            var deferred = $q.defer();
                            require([loadController], function () {
                                $rootScope.$apply(function () {
                                    deferred.resolve();
                                });
                            });
                            return deferred.promise;
                        }]
                }
            }))

            .otherwise({
                redirectTo: '/'
            })


        //$routeProvider
        //    .when("/:section/:tree", angularAMD.route({
        //
        //        templateUrl: function (rp) {
        //            return 'views/' + rp.section + '/' + rp.tree + '.html';
        //        },
        //
        //        resolve: {
        //
        //            load: ['$q', '$rootScope', '$location',
        //                function ($q, $rootScope, $location) {
        //
        //                    var path = $location.path();
        //                    var parsePath = path.split("/");
        //                    var parentPath = parsePath[1];
        //                    var controllerName = parsePath[2];
        //                    var loadController = "views/" + parentPath + "/" + controllerName + "Controller";
        //
        //                    var deferred = $q.defer();
        //                    require([loadController], function () {
        //                        $rootScope.$apply(function () {
        //                            deferred.resolve();
        //                        });
        //                    });
        //                    return deferred.promise;
        //                }]
        //        }
        //    }))
        //
        //    .otherwise({
        //        redirectTo: '/'
        //    })

    }]);


    var indexController = function ($scope, $rootScope, $http, $location) {
        //alert(JSON.stringify(Object.keys($scope)));
    }
    //indexController.$inject = ['$scope', '$rootScope', '$http', '$location'];
    app.controller("indexController", indexController);
    angularAMD.bootstrap(app);

    return app;
});


//app.config(function (/*blockUIConfigProvider*/) {
//
//    //alert('blockui');
//    // Change the default overlay message
//    //blockUIConfigProvider.message("executing...");
//    // Change the default delay to 100ms before the blocking is visible
//    //blockUIConfigProvider.delay(1);
//    // Disable automatically blocking of the user interface
//    //blockUIConfigProvider.autoBlock(false);
//
//});

//__________________________________fromIndexController_________________________


//$scope.$on('$routeChangeStart', function (scope, next, current) {
//
//});
//
//$scope.$on('$routeChangeSuccess', function (scope, next, current) {
//
//});

//$scope.initializeController = function () {
//
//    $scope.initializeApplication($scope.initializeApplicationComplete, $scope.initializeApplicationError);
//
//}

//$scope.initializeApplication = function (successFunction, errorFunction) {
//blockUI.start();
//$scope.AjaxGet("/rest/menu", successFunction, errorFunction);
//blockUI.stop();
//};

//$scope.initializeApplicationComplete = function (response) {

//$rootScope.MenuLabItems = response;
//$rootScope.displayContent = true;

//};


/*function formatMessage(message) {
 var messageBox = "";
 if (angular.isArray(message) == true) {
 for (var i = 0; i < message.length; i++) {
 messageBox = messageBox + message[i] + "<br/>";
 }
 } else {
 messageBox = message;
 }

 return messageBox;

 }*/


/*function supports_html5_storage() {
 try {
 return 'localStorage' in window && window['localStorage'] !== null;
 } catch (e) {
 return false;
 }
 }*/


/*.when("/:section/:tree/:id", angularAMD.route({

 templateUrl: function (rp) {
 return 'views/' + rp.section + '/' + rp.tree + '.html';
 },

 resolve: {

 load: ['$q', '$rootScope', '$location', function ($q, $rootScope, $location) {

 var path = $location.path();
 var parsePath = path.split("/");
 var parentPath = parsePath[1];
 var controllerName = parsePath[2];

 var loadController = "Views/" + parentPath + "/" + controllerName + "Controller";

 var deferred = $q.defer();
 require([loadController], function () {
 $rootScope.$apply(function () {
 deferred.resolve();
 });
 });
 return deferred.promise;
 }]
 }

 }))*/