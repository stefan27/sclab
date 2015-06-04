"use strict";

define(['app-conf'], function (app) {

    app.register.controller('Lab3cSysanaliz', ['$scope', '$rootScope', '$location',
        function ($scope, $rootScope, $location) {

            $scope.initializeController = function () {
                $scope.inputValue = 10;
                $scope.outputValue = $scope.factor(10);
            };

            $scope.factor = function (arg) {
                var res = 1;
                for (; arg > 1; arg--)  res *= arg;
                return res;
            }

            $scope.setValue = function () {
                $scope.outputValue = $scope.factor($scope.inputValue);
            }

        }]);  //endController


});
