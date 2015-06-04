"use strict";

define(['app-conf'], function (app) {

    app.register.controller('Lab4cSysanaliz', ['$scope', '$rootScope', '$location',
        function ($scope, $rootScope, $location) {


            $scope.initializeController = function () {
                $scope.lambda = 24;
                $scope.segHour = 0.4;
                $scope.segMin = 5 / 60;
                $scope.mu = 1 / $scope.segMin;
                $scope.p = $scope.lambda / $scope.mu;

                $scope.inputValue = 5;
                $scope.set();
            };

            function factor(arg) {
                var res = 1;
                for (; arg > 1; arg--)  res *= arg;
                return res;
            }

            $scope.set = function () {

                var p = $scope.p;

                var P0 = 0;

                for (var i = 1; i <= $scope.inputValue; i++) {
                    P0 += Math.pow(p, i) / factor(i);
                }

                P0 = 1 / (1 + P0);

                var P_otk = Math.pow(p, $scope.inputValue) * P0 / factor($scope.inputValue);
                var P_obs = 1 - P_otk;
                var n = p * P_obs;
                var k = n / $scope.inputValue;
                var A = $scope.segHour * P_obs;

                $scope.pObs = (P_obs * 100).toFixed(3) + "%";
                $scope.pOtk = (P_otk * 100).toFixed(3) + "%";
                $scope.pK = (k * 100).toFixed(3) + "%";
            };




        }]);  //endController


});
