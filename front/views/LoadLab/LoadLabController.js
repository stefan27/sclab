"use strict";

define(['app-conf', 'dataService',
    'Lab2cCluster',
    'Lab3cCluster',
    'Lab2cGraphic',
    'Lab3cGraphic',
    'Lab1cNumeric',
    'Lab2cNumeric',
    'Lab3cSysanaliz',
    'Lab4cSysanaliz'

], function (app) {

    app.register.controller('LoadLabController', ['$scope', '$rootScope', '$location', '$routeParams', 'dataService',

        function ($scope, $rootScope, $location, $routeParams, dataService) {

            $scope.urlHtml = './views/' + $routeParams.item + '/' + $routeParams.lab + '.html';
            $scope.urlContr = './views/' + $routeParams.item + '/' + $routeParams.lab + 'Controller';
            $scope.urlTask = './views/' + $routeParams.item + '/' + $routeParams.lab + 'Task.html';

            $scope.selectTask = function () {
                $scope.selection = $scope.labItems[0];
            }

            $scope.selectContent = function () {
                $scope.selection = $scope.labItems[1];
            }

            $scope.labItems = ['task', 'content'];
            $scope.selection = $scope.labItems[0];

            $scope.initializeController = function () {

                $scope.query = {
                    item: $routeParams.item,
                    lab: $routeParams.lab
                }

                dataService.loadlab($scope.query, $scope.loadlabCompleted, $scope.loadlabError);

            }

            $scope.loadlabCompleted = function (res, status) {
                $scope.lab = JSON.parse(res.resLab);
                $scope.fullNameItem = JSON.parse(res.resItem).fullName;
            }

            $scope.loadlabError = function (res, status) {

            }
        }

    ]); //end Controller

    app.register.filter('pInt', function () {
        return function (value) {
            if (!value) return '';

            return 'Лаб ' + value.charAt(3);
        };
    });


});
