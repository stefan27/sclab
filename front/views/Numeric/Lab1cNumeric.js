"use strict";

define(['app-conf', 'numericService', 'alertsService'], function (app) {

    app.register.controller('Lab1cNumeric', ['$scope', '$rootScope', '$location', 'numericService', 'alertsService',
        function ($scope, $rootScope, $location, numericService, alertsService) {

            $scope.a = 1;
            $scope.b = 2;

            $scope.n = 10;
            $scope.h = ($scope.b - $scope.a) / $scope.n;

            $scope.X = [-0.97390, -0.86506, -0.67940, -0.43339, -0.14887,
                0.14887, 0.43339, 0.67940, 0.86506, 0.97390
            ];

            $scope.A = [0.06667, 0.14945, 0.21908, 0.26926, 0.29552,
                0.29552, 0.26926, 0.21908, 0.14945, 0.06667
            ];

            $scope.myFunc = function (x) {
                return 3 * x + 4 * Math.log(x);
            }

            $scope.gauss = function () {
                var res = 0;

                for (var i = 0; i < $scope.n; i++) {
                    var Z = ($scope.a + $scope.b) / 2 + ($scope.b - $scope.a) / 2 * $scope.X[i];
                    res += $scope.A[i] * $scope.myFunc(Z);
                }

                $scope.gauss = (($scope.b - $scope.a) / 2) * res;
            }

            $scope.simpson = function () {
                var sumOdd = 0;
                var sumEven = 0;

                for (var i = 1; i < $scope.n; i += 2) {
                    sumOdd += $scope.myFunc($scope.a + i * $scope.h);
                }

                for (var i = 2; i < $scope.n - 1; i += 2) {
                    sumEven += $scope.myFunc($scope.a + i * $scope.h);
                }

                $scope.simpson = ($scope.h / 3) * ($scope.myFunc($scope.a) +
                    4 * sumOdd + 2 * sumEven + $scope.myFunc($scope.b));
            }

            $scope.trapez = function () {

                var sum1 = ($scope.h / 2) * ($scope.myFunc($scope.a) + $scope.myFunc($scope.b));
                var sum2 = 0;

                for (var i = 1; i < $scope.n - 1; i++) {
                    sum2 += $scope.myFunc($scope.a + i * $scope.h);
                }

                $scope.trapez = sum1 + $scope.h * sum2;
            }

            $scope.rect = function () {

                // Left
                var sumLeft = 0;

                for (var i = 0; i < ($scope.n - 1); i++) {
                    sumLeft += $scope.myFunc($scope.a + i * $scope.h);
                }
                sumLeft = $scope.h * sumLeft;

                // Right
                var sumRight = 0;
                for (var i = 1; i < $scope.n; i++) {
                    sumRight += $scope.myFunc($scope.a + i * $scope.h);
                }
                sumRight = $scope.h * sumRight;

                // Middle
                var sumMiddle = 0;
                for (var i = 0; i < $scope.n; i++) {
                    sumMiddle += $scope.myFunc($scope.a + (i + 0.5) * $scope.h);
                }
                sumMiddle = $scope.h * sumMiddle;

                $scope.rect = {
                    l: sumLeft,
                    m: sumMiddle,
                    r: sumRight
                };
            }

            $scope.initializeController = function () {

                $scope.simpson();
                $scope.gauss();
                $scope.trapez();
                $scope.rect();

            }

        }
    ]); // end Controller



    app.register.directive('chart1numeric', function () {
        return {
            scope: {
                a: '=',
                b: '='
            },
            restrict: 'A',
            link: function (scope, element, attrs) {

                var spx = 25;
                var center = {};
                var coord = {};
                var sizeCursor = 10;
                var mouseClick = false;
                var downPos = {};

                function draw() {

                    if (scope.a && scope.b && scope.a < scope.b) {

                        element[0].width = 758;
                        element[0].height = 758;

                        var ctx = element[0].getContext('2d');
                        var w = element[0].width;
                        var h = element[0].height;
                        var hatchStep = spx;
                        var hatchSize = 4;

                        ctx.fillStyle = "#ffffff";
                        ctx.clearRect(0, 0, w, h);
                        ctx.fillRect(0, 0, w, h);

                        ctx.beginPath();

                        ctx.lineCap = "round"; // сглаживание концов линии
                        ctx.lineJoin = "round"; // сглаживание перегибов линии
                        ctx.lineWidth = 1;

                        //__________________________TEXT______________________________
                        ctx.font = "16px Consolas";
                        ctx.fillStyle = '#000000';

                        ctx.fillText('  SPX: ' + spx, 10, 30);

                        //__________________________CURSOR______________________________

                        if (sizeCursor) {

                            ctx.moveTo(coord.x - sizeCursor, coord.y);
                            ctx.lineTo(coord.x + sizeCursor, coord.y);

                            ctx.moveTo(coord.x, coord.y - sizeCursor);
                            ctx.lineTo(coord.x, coord.y + sizeCursor);
                        }

                        ctx.stroke();

                        //__________________________COORD PLANE______________________________


                        if (center.x === undefined || center.y === undefined) {
                            if (w % 2 !== 0) {
                                center.x = w / 2 + 0.5;
                                center.y = h / 2 + 0.5;
                            } else {
                                center.x = w / 2;
                                center.y = h / 2;
                            }
                        }

                        ctx.translate(center.x, center.y); //перемещаю начало координат в центр

                        //перемещение графика мышей
                        if (mouseClick) {
                            ctx.translate(coord.x - downPos.x, coord.y - downPos.y);
                        }

                        ctx.beginPath();

                        ctx.strokeStyle = '#A6A6A6';

                        ctx.moveTo(-8 * w / 2, 0.5); //гориз линия
                        ctx.lineTo(8 * w / 2, 0.5);
                        ctx.moveTo(0.5, -8 * h / 2); //верт линия
                        ctx.lineTo(0.5, 8 * h / 2);

                        //отрисовка штриховки
                        for (var i = 0; i <= 8 * w / 2; i += hatchStep) {
                            ctx.moveTo(i + 0.5, -hatchSize / 2);
                            ctx.lineTo(i + 0.5, hatchSize / 2);
                            ctx.moveTo(-hatchSize / 2, i + 0.5);
                            ctx.lineTo(hatchSize / 2, i + 0.5);
                        }

                        for (var i = 0; i >= -8 * w / 2; i -= hatchStep) {
                            ctx.moveTo(i + 0.5, -hatchSize / 2);
                            ctx.lineTo(i + 0.5, hatchSize / 2);
                            ctx.moveTo(-hatchSize / 2, i + 0.5);
                            ctx.lineTo(hatchSize / 2, i + 0.5);
                        }

                        ctx.stroke();

                        //__________________________CHART______________________________

                        ctx.beginPath();

                        ctx.lineWidth = 2;
                        ctx.strokeStyle = '#3366CC';

                        scope.a = Number(scope.a);
                        scope.b = Number(scope.b);

                        if (scope.a > 0) {

                            for (var i = 0; i >= -(3 * scope.a + 4 * Math.log(scope.a)) * spx; i -= 8) {
                                ctx.moveTo(scope.a * spx, i);
                                ctx.lineTo(scope.a * spx, i + 1);
                            }
                        }

                        ctx.moveTo(scope.a * spx, -(3 * scope.a + 4 * Math.log(scope.a)) * spx);
                        for (var i = scope.a; i <= scope.b + 0.01; i += 0.1) {
                            ctx.lineTo(i * spx, -(3 * i + 4 * Math.log(i)) * spx);
                        }

                        if (scope.b > 0) {
                            for (var i = 0; i >= -(3 * scope.b + 4 * Math.log(scope.b)) * spx; i -= 8) {
                                ctx.moveTo(scope.b * spx, i);
                                ctx.lineTo(scope.b * spx, i + 1);
                            }
                        }

                        ctx.stroke();

                        ctx.restore();
                    }

                }

                //__________________________EVENTS______________________________

                scope.$watch('a', function () {
                    draw();
                });

                scope.$watch('b', function () {
                    draw();
                });


                $(window).resize(function () {
                    draw();
                });

                element.bind('mouseover', function () {
                    element.css('cursor', 'none');
                    sizeCursor = 10;
                });

                element.bind('mouseleave', function () {
                    sizeCursor = undefined;
                    draw();
                });

                element.bind('mousedown', function () {
                    downPos.x = coord.x;
                    downPos.y = coord.y;
                    mouseClick = true;
                    draw();
                });

                element.bind('mouseup', function () {
                    center.x = center.x + (coord.x - downPos.x);
                    center.y = center.y + (coord.y - downPos.y);
                    mouseClick = false;
                    draw();
                });

                element.bind('mousemove', function (evt) {
                    var rect = element[0].getBoundingClientRect();
                    coord.x = evt.clientX - rect.left;
                    coord.y = evt.clientY - rect.top;
                    draw();
                });

                element.bind("DOMMouseScroll mousewheel onmousewheel", function (event) {

                    var event = window.event || event; // old IE support
                    var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

                    if (delta > 0) {
                        scope.$apply(function () {
                            if (spx < 300) {
                                spx++;
                                draw();
                            }
                        });

                        event.returnValue = false; // for IE

                        if (event.preventDefault) {
                            event.preventDefault(); // for Chrome and Firefox
                        }

                    } else if (delta < 0) {
                        scope.$apply(function () {
                            if (spx > 4) {
                                spx--;
                                draw();
                            }
                        });

                        event.returnValue = false; // for IE

                        if (event.preventDefault) {
                            event.preventDefault(); // for Chrome and Firefox
                        }

                    }
                });

                draw();

            }
        }
    }); //end Directive

});
