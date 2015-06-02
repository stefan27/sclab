"use strict";

define(['app-conf', 'numericService', 'alertsService'], function (app) {

    app.register.controller('Lab3cCluster', ['$scope', '$rootScope', '$location', 'numericService', 'alertsService',
        function ($scope, $rootScope, $location, numericService, alertsService) {

            /*$scope.data = [
                [1.25, 1.36, 1.28, 1.26, 1.29],
                [0.99, 1.13, 1.26, 1.19, 1.21],
                [1.32, 1.37, 1.38, 1.29, 1.3]
            ];*/

            $scope.data = [
                [1.25, 1.34, 1.28, 1.26, 1.29],
                [1.01, 1.04, 1.26, 1.19, 1.21],
                [1.32, 1.35, 1.36, 1.29, 1.3]
            ];

            $scope.initializeController = function () {

                $scope.n = 5;
                $scope.m = 3;
                $scope.prec = 4;

                // Вычисляю среднее по столбцам
                var mid = [];
                var sum = 0;

                for (var j in $scope.data[0]) {
                    for (var i in $scope.data) {
                        sum += $scope.data[i][j];
                    }
                    mid.push(sum / 3);
                    sum = 0;
                }

                // Вычисляю общее среднее
                var generalMid = 0;

                for (var i in mid) {
                    generalMid += mid[i];
                }

                generalMid /= 5;

                // Вычисляю суммы квадратов отклонений выборочных средних от общего среднего
                var sum1 = 0;

                for (var i in mid) {
                    sum1 += Math.pow(mid[i], 2);
                }

                $scope.sumSquaredDeviations = ($scope.m * sum1) - ($scope.n * $scope.m * Math.pow(generalMid, 2));

                // Вычисляю общую сумму отклонений наблюдаемого значения х от общего среднего
                var sum2 = 0;

                for (var i in $scope.data) {
                    for (var j in $scope.data[i]) {
                        sum2 += Math.pow($scope.data[i][j], 2);
                    }
                }

                $scope.generalSumSquaredDeviations = sum2 - $scope.n * $scope.m * Math.pow(generalMid, 2);

                // Вычисляю остаток
                $scope.residue = $scope.generalSumSquaredDeviations - $scope.sumSquaredDeviations;

                // Вычисляю дисперсии
                $scope.generalDispersion = $scope.generalSumSquaredDeviations / ($scope.n * $scope.m - 1);

                $scope.factorDispersion = $scope.sumSquaredDeviations / ($scope.m - 1);

                $scope.dispersion = $scope.residue / ($scope.m * ($scope.n - 1));


                var ans = ($scope.factorDispersion / $scope.dispersion).toFixed(2);

                if (ans < 19.41) {
                    $scope.answer = ans + " < 19.41. Таким образом гипотеза о не влиянии факторов верна.";
                }
                else {
                    $scope.answer = ans + " >= 19.41. Таким образом гипотеза о не влиянии факторов не верна.";
                }
            }
        }


    ]); //end Controller
});
