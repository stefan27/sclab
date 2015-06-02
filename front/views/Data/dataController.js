"use strict";

define(['app-conf', 'dataService'], function (app) {

    app.register.controller('DataController', ['$scope', '$rootScope', '$location', 'dataService',
        function ($scope, $rootScope, $location, dataService) {

            $scope.initializeController = function () {
                dataService.data({}, $scope.dataCompleted, $scope.dataError);

            }

            $scope.dataCompleted = function (res, status) {

                $scope.data = JSON.parse(res.data);
            }

            $scope.dataError = function (res, status) {
                //alert(res.ReturnMessage);
            }


        }]); //end Controller

    app.register.directive('triangle', function () {
        return {
            scope: {},
            restrict: 'A',

            link: function (scope, element) {

                element.find('h2').bind('click', function () {
                    if (element.find('.ul-data').css("display") == 'none') {

                        element.find('.ul-data').css("display", "block");
                        element.find('.octicon-data').removeClass('octicon-chevron-right')
                            .addClass('octicon-chevron-down');
                    }
                    else {
                        element.find('.ul-data').css("display", "none");
                        element.find('.octicon-data').removeClass('octicon-chevron-down')
                            .addClass('octicon-chevron-right');
                    }

                });

            }
        }
    }); //end Directive

    app.register.filter('capitalize', function () {
        return function (input, scope) {
            if (input != null) {
                input = input.toLowerCase();
            }
            return input.substring(0, 1).toUpperCase() + input.substring(1);
        }
    });

});
