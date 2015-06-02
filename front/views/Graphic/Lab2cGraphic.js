"use strict";

define(['app-conf', 'graphicService', 'alertsService'], function (app) {
    app.register.controller('Lab2cGraphic', ['$scope', '$rootScope', '$location', 'graphicService', 'alertsService',
        function ($scope, $rootScope, $location, graphicService, alertsService) {

            $scope.encode = function() {

                //_______compileDictionary

                var dict = [];
                var symbThere = false;

                for (var i = 0; i < $scope.strEncode.length; i++) {

                    for (var j = 0; j < dict.length; j++) {
                        if (dict[j].s === $scope.strEncode[i]) {
                            symbThere = true;
                            dict[j].n++;
                            break;
                        }
                    }

                    if (!symbThere) {
                        dict.push({s: $scope.strEncode[i], n: 1});
                    }

                    symbThere = false;
                }


                //________divideByTheProportion

                var sum = 0;

                for (var i = 0; i < dict.length; i++) {
                    dict[i].d = sum + dict[i].n / $scope.strEncode.length;
                    sum += dict[i].n / $scope.strEncode.length;
                }

                //________aryphMethod

                var beg = 0;
                var end = 1;
                var oldBeg = 0;
                var oldEnd = 0;

                for (var i = 0; i < $scope.strEncode.length; i++) {

                    for (var j = 0; j < dict.length; j++) {

                        if (dict[j].s === $scope.strEncode[i]) {
                            if (i === 0) {
                                if (j !== 0) {
                                    beg = dict[j - 1].d;
                                }
                                end = dict[j].d;
                            }
                            else {
                                oldBeg = beg;
                                oldEnd = end;

                                if (j !== 0) {
                                    beg = oldBeg + (oldEnd - oldBeg) * dict[j - 1].d;
                                }
                                if (j !== dict.length - 1) {
                                    end = oldBeg + (oldEnd - oldBeg) * dict[j].d;
                                }
                            }
                            break;
                        }
                    }
                }

                $scope.code = (end+beg)/2;


                //____________decode

                var eof = false;
                $scope.decode = '';
                dict[0].b = 0;

                for (var i = 0; i < dict.length; i++) {
                    dict[i].r = dict[i].d;
                }

                for (var i = 0; !eof && i < 100; i++) {
                    for (var j = 0; j < dict.length; j++) {

                        if (j === 0) {
                            if ($scope.code >= dict[0].b && $scope.code <= dict[0].r) {

                                if(dict[0].s === '!') {
                                    eof = true;
                                }

                                beg = dict[0].b;
                                end = dict[0].r;

                                dict[dict.length - 1].r = dict[0].r;

                                for (var k = 0; k < dict.length - 1; k++) {
                                    dict[k].r = beg + (end - beg) * dict[k].d;
                                }

                                $scope.decode += dict[0].s;

                                break;
                            }

                        }
                        else {
                            if ($scope.code >= dict[j - 1].r && $scope.code <= dict[j].r) {

                                if(dict[j].s === '!') {
                                    eof = true;
                                }

                                beg = dict[j - 1].r;
                                end = dict[j].r;

                                dict[0].b = dict[j - 1].r;
                                dict[dict.length - 1].r = dict[j].r;

                                for (var k = 0; k < dict.length - 1; k++) {
                                    dict[k].r = beg + (end - beg) * dict[k].d;
                                }

                                $scope.decode += dict[j].s;

                                break;
                            }
                        }

                    }

                }
            }

            $scope.strEncode = 'picturePICTURE!';

            $scope.code = 0;

            $scope.decode = '';


            $scope.insertStr = function(str) {
                $scope.strEncode = str;
                $scope.encode();
            }

            $scope.initializeController = function () {

                graphicService.graphicLab2({}, $scope.graphicLab2Completed, $scope.graphicLab2Error);
                $scope.encode();
            }

            $scope.graphicLab2Completed = function(res, status) {
                $scope.strings = JSON.parse(res.strings);
                $scope.encode();
            }

            $scope.graphicLab2Error = function(res, status) {
                alert('error');
            }

        }
    ]);
});
