"use strict";

define(['app-conf', 'numericService', 'alertsService'], function (app) {

    app.register.controller('Lab2cNumeric', ['$scope', '$rootScope', '$location', 'numericService', 'alertsService',
        function ($scope, $rootScope, $location, numericService, alertsService) {

            /*$scope.f = function (x, y) {
             return 2 * y - x - (y * y) / x + y / x;
             };*/

            $scope.f = function (x, y) {
                return Math.cos(y)/Math.sin(y);
            };

            $scope.eps = 1 / 100;
            $scope.prec = 6;

            $scope.a = 1;
            $scope.b = 2;
            $scope.n = 10;

            /*$scope.x0 = 1;
             $scope.y0 = 1.5;*/

            $scope.x0 = 1;
            $scope.y0 = 0;

            function rcAdeptFunc() {

                var h = ($scope.b - $scope.a) / $scope.n;
                var x = [];
                var y = [];
                var k = [0];
                var delta = [0];

                x[0] = $scope.x0;
                y[0] = $scope.y0;

                for (var i = 0; ($scope.b - x[i]) > $scope.eps; i++) {
                    k[1 + i] = h * $scope.f(x[i], y[i]);
                    k[2 + i] = h * $scope.f(x[i] + h, y[i] + k[1 + i]);
                    y[1 + i] = y[i] + (k[1 + i] + k[2 + i]) / 2;
                    k[1 + i] = (h / 2) * $scope.f(x[i], y[i]);
                    k[2 + i] = (h / 2) * $scope.f(x[i] + (h / 2), y[i] + k[1 + i]);
                    y[1 + 2 + i] = y[i] + (k[1 + i] + k[2 + i]) / 2;
                    k[1 + i] = (h / 2) * $scope.f(x[i] + h / 2, y[1 + 2 + i]);
                    k[2 + i] = (h / 2) * $scope.f(x[i] + (h / 2) + (h / 2), y[1 + 2 + i] + k[1 + i]);
                    y[2 + i] = y[1 + 2 + i] + (k[1 + i] + k[2 + i]) / 2;

                    delta[i] = Math.abs(y[2 + i] - y[1 + i]) / 3;

                    if (delta[i] < $scope.eps) {
                        x[1 + i] = x[i] + h;
                        y[1 + i] = y[2 + i] + (y[2 + i] - y[1 + i]) / 3;
                        if (delta[i] < $scope.eps / (2 * 2 * 2)) {
                            h *= 2;
                            if (h > ($scope.b - x[i + 1])) {
                                h = ($scope.b - x[i + 1]);
                            }
                        }
                        else {
                            h /= 2;
                            i--;
                        }
                        $scope.steps = i + 1;
                    }
                }

                return {
                    x: x,
                    y: y
                }
            };

            function rcConstStepsFunc() {

                var h = 1 / $scope.steps;
                var x = [];
                var y = [];
                var k = [0];

                x[0] = $scope.x0;
                y[0] = $scope.y0;

                for (var i = 0; i < $scope.steps; i++) {
                    k[i + 1] = h * $scope.f(x[i], y[i]);
                    k[i + 2] = h * $scope.f(x[i] + h, y[i] + k[i + 1]);
                    y[i + 1] = y[i] + (k[i + 1] + k[i + 2]) / 2;
                    x[i + 1] = x[i] + h;
                }

                return {
                    x: x,
                    y: y
                }
            }

            function adamsFunc() {

                var h = 1 / 10;
                var x = [];
                var y = [];
                var k = [];

                x[0] = $scope.x0;
                y[0] = $scope.y0;

                for (var i = 0; i < 4; i++) {
                    k[1 + i] = h * $scope.f(x[i], y[i]);
                    k[2 + i] = h * $scope.f(x[i] + h, y[i] + k[1 + i]);
                    y[1 + i] = y[i] + (k[1 + i] + k[2 + i]) / 2;
                    x[1 + i] = x[i] + h;
                }

                h = ($scope.b - $scope.a) / $scope.n;

                for (var i = 3; ($scope.b - x[i]) > $scope.eps; i++) {
                    y[i + 1] = y[i] + (h / 24) * (55 * $scope.f(x[i], y[i])
                        - 59 * $scope.f(x[i - 1], y[i - 1])
                        + 37 * $scope.f(x[i - 2], y[i - 2])
                        - 9 * $scope.f(x[i - 3], y[i - 3]));
                    x[i + 1] = x[i] + h;
                }

                return {
                    x: x,
                    y: y
                }

            }

            $scope.initializeController = function () {

                $scope.adept = rcAdeptFunc();
                $scope.rc = rcConstStepsFunc();
                $scope.adams = adamsFunc();

            }

        }
    ])
    ; // end Controller

    app.register.directive('chart2numeric', function () {
        return {
            scope: {
                a: '=',
                b: '=',
                adept: "=",
                rc: "=",
                adams: "="
            },
            restrict: 'A',

            link: function (scope, element) {

                var spx = 6;
                var center = {};
                var coord = {};
                var sizeCursor = 10;
                var mouseClick = false;
                var downPos = {};
                var a = scope.a;
                var b = scope.b;

                function draw() {

                    if (a && b && a < b) {

                        element[0].width = 756;
                        element[0].height = element[0].width;

                        var ctx = element[0].getContext('2d');
                        var w = element[0].width;
                        var h = element[0].height;
                        var hatchStep = spx; //шаг малой штриховки
                        var hatchSize = 4; //размер малой штриховки
                        var bigHatchStep = 5 * hatchStep; //шаг большой штриховки
                        var bigHatchSize = 3 * hatchSize; //размер большой штриховки

                        var inter = ((b - a) / 10);

                        //вычисляю мин макс
                        var aY = scope.adept.y[0];
                        var bY = aY;

                        for (var i = 0; i < scope.adept.x.length; i++) {
                            if (scope.adept.y[i] < aY) {
                                aY = scope.adept.y[i]
                            }
                            else if (scope.adept.y[i] > bY) {
                                bY = scope.adept.y[i];
                            }
                        }

                        var aY = Math.floor(Number(aY)); //начальный интервал
                        var bY = Math.ceil(Number(bY)); //конечный интервал

                        var interY = (bY - aY) / 10;


                        ctx.beginPath();

                        ctx.fillStyle = "#ffffff";
                        ctx.clearRect(0, 0, w, h);
                        ctx.fillRect(0, 0, w, h);

                        ctx.lineCap = "round"; // сглаживание концов линии
                        ctx.lineJoin = "round"; // сглаживание перегибов линии
                        ctx.lineWidth = 1;

                        //__________________________TEXT______________________________
                        ctx.font = "16px Consolas";
                        ctx.fillStyle = '#000000';

                        ctx.fillText('  SPX: ' + spx, 0.85 * w, 40);

                        //__________________________CURSOR______________________________

                        if (sizeCursor) {
                            ctx.moveTo(coord.x - sizeCursor, coord.y); //гориз линия
                            ctx.lineTo(coord.x + sizeCursor, coord.y);

                            ctx.moveTo(coord.x, coord.y - sizeCursor); //гориз линия
                            ctx.lineTo(coord.x, coord.y + sizeCursor);
                        }

                        ctx.stroke();

                        //__________________________COORD PLANE______________________________

                        //смещаю начало отрисовки в левый нижний угол
                        if (center.x === undefined || center.y === undefined) {
                            if (w % 2 !== 0) {
                                center.x = 0.1 * h + 0;
                                center.y = 0.9 * w + 0;
                            } else {
                                center.x = 0.1 * h;
                                center.y = 0.9 * w;
                            }
                        }

                        //смещаю начало отрисовки в левый нижний угол
                        ctx.translate(center.x, center.y);

                        if (mouseClick) {
                            //смещай график при передвижении мыши
                            ctx.translate(coord.x - downPos.x, coord.y - downPos.y);
                        }

                        ctx.beginPath();

                        ctx.strokeStyle = '#A6A6A6';

                        ctx.moveTo(0, 0); //гориз линия
                        ctx.lineTo(4 * w, 0);
                        ctx.moveTo(0, -4 * h); //верт линия
                        ctx.lineTo(0, 0);

                        //рисую горизонтальную малую штриховку
                        for (var i = hatchStep; i <= 8 * w / 2; i += hatchStep) {
                            ctx.moveTo(i + 0, 0);
                            ctx.lineTo(i + 0, hatchSize);
                        }

                        //рисую вертикальную малую штриховку
                        for (var i = -hatchStep; i >= -8 * w / 2; i -= hatchStep) {
                            ctx.moveTo(-hatchSize, i + 0);
                            ctx.lineTo(0, i + 0);
                        }

                        ctx.stroke();

                        ctx.beginPath();

                        ctx.font = "bold 9px Helvetica, 'Trebuchet MS', sans-serif";
                        ctx.fillStyle = '#393939';

                        //рисую горизонтальную большую штриховку
                        for (var i = bigHatchStep; i <= 8 * w / 2; i += bigHatchStep) {
                            ctx.moveTo(i + 0, 0);
                            ctx.lineTo(i + 0, bigHatchSize);
                        }

                        //рисую вертикальную большую штриховку
                        for (var i = -bigHatchStep; i >= -8 * w / 2; i -= bigHatchStep) {
                            ctx.moveTo(-bigHatchSize, i + 0);
                            ctx.lineTo(0, i + 0);
                        }

                        //рисую значения горизонтальной штриховки
                        for (var i = -bigHatchStep, j = inter; j <= b; j += inter, i -= bigHatchStep) {
                            ctx.fillText(j.toFixed(1), -i - 7, 2.2 * bigHatchSize);
                        }

                        //рисую значения вертикальной штриховки
                        for (var i = -bigHatchStep, j = aY; j <= bY; j += 0.25, i -= bigHatchStep) {
                            ctx.fillText(j.toFixed(2), -3 * bigHatchSize, i + 4);
                        }

                        ctx.stroke();

                        ctx.beginPath();

                        ctx.strokeStyle = '#DFDFDF';

                        //рисую вертикальную большую штриховку
                        for (var i = -bigHatchStep; i >= -8 * w / 2; i -= bigHatchStep) {
                            ctx.moveTo(0, i + 0);
                            ctx.lineTo(8 * w / 2, i + 0);
                        }

                        ctx.stroke();

                        //__________________________CHART__1____________________

                        for (var i = 0; i < scope.adept.x.length; i++) {
                            ctx.beginPath();
                            ctx.arc(scope.adept.x[i] * 10 * bigHatchStep, -scope.adept.y[i] * 4 * bigHatchStep + 7.5 * bigHatchSize, 5, 0, 2 * Math.PI);
                            ctx.fillStyle = '#326464';
                            ctx.fill();
                            ctx.stroke();
                        }

                        //__________________________CHART__2______________________

                        for (var i = 0; i < scope.rc.x.length; i++) {
                            ctx.beginPath();
                            ctx.arc(scope.rc.x[i] * 10 * bigHatchStep, -scope.rc.y[i] * 4 * bigHatchStep + 7.5 * bigHatchSize, 5, 0, 2 * Math.PI);
                            ctx.fillStyle = '#819B4D';
                            ctx.fill();
                            ctx.stroke();
                        }

                        //__________________________CHART__3______________________

                        for (var i = 0; i < scope.adams.x.length; i++) {
                            ctx.beginPath();
                            ctx.arc(scope.adams.x[i] * 10 * bigHatchStep, -scope.adams.y[i] * 4 * bigHatchStep + 7.5 * bigHatchSize, 5, 0, 2 * Math.PI);
                            ctx.fillStyle = '#A65353';
                            ctx.fill();
                            ctx.stroke();
                        }


                        //ctx.translate(0.5,0.5);
                        //ctx.restore();
                    }

                }

                //__________________________EVENTS______________________________

                //scope.$watch('numberChart', function () {
                //    draw();
                //});

                element.bind('mouseover', function () {
                    element.css('cursor', 'none');
                    sizeCursor = 10;
                });

                element.bind('mouseleave', function () {
                    sizeCursor = undefined;
                    draw();
                });

                element.bind('mousedown', function (e) {
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
