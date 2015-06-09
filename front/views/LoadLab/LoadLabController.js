"use strict";

define(['app-conf', 'highlight', 'angular-highlight', 'dataService',
    'angular-css-injector',
    'Lab2cCluster',
    'Lab3cCluster',
    'Lab2cGraphic',
    'Lab3cGraphic',
    'Lab1cNumeric',
    'Lab2cNumeric',
    'Lab3cSysanaliz',
    'Lab4cSysanaliz'

], function (app) {

    app.register.controller('LoadLabController', ['$scope', '$rootScope',
        '$location', '$routeParams', 'dataService', 'cssInjector',

        function ($scope, $rootScope, $location, $routeParams, dataService, cssInjector) {

            $scope.urlHtml = './views/' + $routeParams.item + '/' + $routeParams.lab + '.html';
            $scope.urlContr = './views/' + $routeParams.item + '/' + $routeParams.lab + 'Controller';
            $scope.urlTask = './views/' + $routeParams.item + '/' + $routeParams.lab + 'Task.html';
            $scope.urlCode = './views/' + $routeParams.item + '/' + $routeParams.lab + 'Code.html';

            $scope.selectTask = function () {
                $scope.selection = $scope.labItems[0];
            };

            $scope.selectContent = function () {
                $scope.selection = $scope.labItems[1];
            };

            $scope.selectCode = function () {
                $scope.selection = $scope.labItems[2];
            };

            $scope.styles = [
                {str: 'Vs', name: 'vs'},
                {str: 'Tomorrow-night', name: 'tomorrow-night-bright'},
                {str: 'Sunburst', name: 'sunburst'},
                {str: 'Ir black', name: 'ir_black'},
                {str: 'Hybrid', name: 'hybrid'},
                {str: 'Far', name: 'far'},
                {str: 'Atelier dune dark', name: 'atelier-dune.dark'},
                {str: 'Arta', name: 'arta'},
                {str: 'Android Studio', name: 'androidstudio'},
                {str: 'Dark', name: 'dark'},
                {str: 'Monokai Sublime', name: 'monokai_sublime'},
                {str: 'Agate', name: 'agate'}
            ];


            $scope.selectStyle = function (style) {
                cssInjector.removeAll();
                cssInjector.add("/style/css/highlight/" + style + '.css');
            };

            $scope.labItems = ['task', 'content', 'code'];
            $scope.selection = $scope.labItems[2];

            $scope.initializeController = function () {

                $scope.query = {
                    item: $routeParams.item,
                    lab: $routeParams.lab
                };

                dataService.loadlab($scope.query, $scope.loadlabCompleted, $scope.loadlabError);

            };

            $scope.loadlabCompleted = function (res, status) {
                $scope.lab = JSON.parse(res.resLab);
                $scope.fullNameItem = JSON.parse(res.resItem).fullName;
            };

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

    app.register.directive('displayDownmenu', function () {
        return {
            scope: {},
            restrict: 'A',

            link: function (scope, element, attr) {

                var hc = element.find('ul');

                element.bind('click', function () {
                    scope.$apply(function () {

                        if (hc.css('display') == 'none') {
                            hc.css('display', 'block');
                        }
                        else if (hc.css('display') == 'block') {
                            hc.css('display', 'none');
                        }
                    })
                });

                element.bind('blur', function (e) {
                    scope.$apply(function () {
                        hc.css('display', 'none');
                    })
                });


            }
        }
    });


});
