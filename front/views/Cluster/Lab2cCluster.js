"use strict";

define(['app-conf', 'numericService', 'alertsService'], function (app) {

    app.register.controller('Lab2cCluster', ['$scope', '$rootScope', '$location', 'numericService', 'alertsService',
        function ($scope, $rootScope, $location, numericService, alertsService) {

            $scope.initializeController = function () {

                $scope.sample = [
                    55, 92, 72, 83, 81, 79, 54, 68, 82, 94, 65, 97, 99, 78, 82, 63, 90, 68, 87, 98, 95,
                    54, 93, 78, 62, 57, 88, 99, 94, 66, 73, 67, 90, 91, 83, 57, 56, 81, 83, 89, 91, 85, 102, 88,
                    97, 93, 58, 67, 93, 78, 85, 78, 85, 78, 108, 86, 91, 93, 88, 75, 68, 94, 104, 84, 101
                ];

                $scope.sample = $scope.sample.sort(function (a, b) {
                    return a - b;
                });

                //формирую массив слотов
                $scope.slots = [];
                var numSlots = 8;
                var a = $scope.sample[0];
                $scope.a = a;
                var b = $scope.sample[$scope.sample.length - 1];

                //делю на промежуток на 8 равных интервалов
                for (var i = 1; i <= numSlots; i++) {
                    $scope.slots.push({
                        n: a + (b - a) * i / numSlots,
                        p: 0
                    });
                }

                //подсчитую количество вхождения для каждого интервала
                for (var i = 0; i < $scope.sample.length; i++) {
                    for (var j = 0; j < $scope.slots.length; j++) {
                        if (j === 0) {
                            if ($scope.sample[i] >= a && $scope.sample[i] < $scope.slots[j].n) {
                                $scope.slots[j].p++;
                            }
                        }
                        else {
                            if ($scope.sample[i] >= $scope.slots[j - 1].n && $scope.sample[i] < $scope.slots[j].n) {
                                $scope.slots[j].p++;
                            }
                        }
                    }
                }

                $scope.slots[$scope.slots.length - 1].p++;

                //узнаю пропорции, т.е делю на количество данных выборки
                for (var i = 0; i < numSlots; i++) {
                    $scope.slots[i].p /= $scope.sample.length;
                }

                //считаю частоты
                for (var i = 0; i < $scope.slots.length; i++) {
                    $scope.slots[i].f = $scope.slots[i].p /
                        (($scope.sample[$scope.sample.length - 1] - $scope.sample[0]) / 8);
                }

                $scope.values4lab();

                $scope.numberChart = 0; //номер графика

                $scope.charts = [{
                    n: 0,
                    title: 'Distribution graph'
                }, {
                    n: 1,
                    title: 'Frequency histogram'
                }];
            }

            //Считаю все значения для лабораторной
            $scope.values4lab = function () {

                var firstMoment = 0;
                var secondMoment = 0;

                for (var i in $scope.sample) {
                    firstMoment += $scope.sample[i];
                    secondMoment += $scope.sample[i] * $scope.sample[i];
                }

                $scope.mean = firstMoment / $scope.sample.length;
                $scope.shiftDis = secondMoment / $scope.sample.length - Math.pow(firstMoment / $scope.sample.length, 2);
                $scope.unShiftDis = secondMoment / ($scope.sample.length - 1) - Math.pow(firstMoment / ($scope.sample.length - 1), 2);
                $scope.deviation = Math.sqrt($scope.shiftDis);

                var thirdMoment = 0;
                var fourthMoment = 0;

                for (var i in $scope.sample) {
                    thirdMoment += Math.pow($scope.sample[i] - $scope.mean, 3);
                    fourthMoment += Math.pow($scope.sample[i] - $scope.mean, 4);
                }

                $scope.koefAsym = thirdMoment / $scope.sample.length / Math.pow($scope.deviation, 3);
                $scope.koefExscess = (fourthMoment / $scope.sample.length / Math.pow($scope.deviation, 4)) - 3;

                var tTable = 2.36;
                $scope.confidInterval = tTable * (Math.sqrt($scope.shiftDis) / Math.sqrt($scope.sample.length));
                $scope.confidInterval = [Number($scope.mean - $scope.confidInterval), Number($scope.mean + $scope.confidInterval)];

                $scope.mean = $scope.mean.toFixed(3);
                $scope.shiftDis = $scope.shiftDis.toFixed(3);
                $scope.unShiftDis = $scope.unShiftDis.toFixed(3);
                $scope.deviation = $scope.deviation.toFixed(3);
                $scope.koefAsym = $scope.koefAsym.toFixed(3);
                $scope.koefExscess = $scope.koefExscess.toFixed(3);
                $scope.confidInterval[0] = $scope.confidInterval[0].toFixed(3);
                $scope.confidInterval[1] = $scope.confidInterval[1].toFixed(3);
            }

            $scope.selectChart = function(n) {
                $scope.numberChart = n;
            }
        }

    ]); //end Controller


    app.register.directive('chart2klaster', function () {
        return {
            scope: {
                a: '=',
                slots: '=',
                numberChart: '='
            },
            restrict: 'A',

            link: function (scope, element) {

                var spx = 8;
                var center = {};
                var coord = {};
                var sizeCursor = 10;
                var mouseClick = false;
                var downPos = {};
                var a = scope.a;
                var b = scope.slots[scope.slots.length - 1].n;

                function draw() {

                    if (a && b && a < b) {

                        element[0].width = 758;
                        element[0].height = 758;

                        var ctx = element[0].getContext('2d');
                        var w = element[0].width;
                        var h = element[0].height;
                        var hatchStep = spx; //шаг малой штриховки
                        var hatchSize = 4; //размер малой штриховки
                        var bigHatchStep = 5 * hatchStep; //шаг большой штриховки
                        var bigHatchSize = 3 * hatchSize; //размер большой штриховки
                        var aHatch = Math.floor(Number(a) / 10) * 10; //начальный интервал
                        var bHatch = Math.ceil(Number(b) / 10) * 10; //конечный интервал

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

                        if (scope.numberChart === 0) {
                            //рисую значения горизонтальной штриховки
                            for (var i = -2 * bigHatchStep, j = aHatch; j <= bHatch; j += 10, i -= bigHatchStep) {
                                ctx.fillText(j, -i - 5, 2.2 * bigHatchSize);
                            }

                            //рисую значения вертикальной штриховки
                            for (var i = -bigHatchStep, j = 0.1; j <= 1; j += 0.1, i -= bigHatchStep) {
                                ctx.fillText(j.toFixed(1), -2 * bigHatchSize, i + 4);
                            }
                        }
                        else if (scope.numberChart === 1) {

                            //рисую значения горизонтальной штриховки
                            if (spx > 7) {
                                for (var i = -bigHatchStep, j = 0; j < scope.slots.length; j++, i -= bigHatchStep) {
                                    ctx.fillText(scope.slots[j].n.toFixed(3), -i - 13, 2.2 * bigHatchSize);
                                }
                            }

                            var max = scope.slots[0].f;
                            //нахожу максимумальную частоту в слотах
                            for (var i = 1; i < scope.slots.length; i++) {
                                if (scope.slots[i].f > max) max = scope.slots[i].f;
                            }

                            //рисую значения вертикальной штриховки
                            for (var i = -bigHatchStep, j = Math.ceil(max * 100) / 100 / 8;
                                 j <= Math.ceil(max * 100) / 100;
                                 j += Math.ceil(max * 100) / 100 / 8, i -= bigHatchStep) {

                                ctx.fillText(j.toFixed(3), -3.2 * bigHatchSize, i + 4);
                            }
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

                        //__________________________CHART__0

                        if (scope.numberChart === 0) {

                            ctx.beginPath();

                            ctx.lineWidth = 2;
                            ctx.strokeStyle = '#315EA0';

                            //рисую первую часть графика
                            var begW = 2 * bigHatchStep + (a - aHatch) * (spx / 2);
                            var begH = 10 * bigHatchStep * scope.slots[0].p;

                            ctx.moveTo(begW, -begH.toFixed(0));
                            ctx.lineTo(begW + (scope.slots[0].n - a) * (spx / 2), -begH.toFixed(0));

                            begW = begW + (scope.slots[0].n - a) * (spx / 2);

                            //рисую остальной график
                            for (var i = 1; i < scope.slots.length; i++) {

                                for (var j = begH; j < (begH + 10 * bigHatchStep * scope.slots[i].p) - 1; j += 8) {
                                    ctx.moveTo(begW.toFixed(0), -j);
                                    ctx.lineTo(begW.toFixed(0), -j - 1);
                                }

                                begH += 10 * bigHatchStep * scope.slots[i].p;

                                ctx.moveTo(begW, -begH.toFixed(0));
                                ctx.lineTo(begW + (scope.slots[i].n - scope.slots[i - 1].n) * (spx / 2), -begH.toFixed(0));

                                begW = begW + (scope.slots[i].n - scope.slots[i - 1].n) * (spx / 2);
                            }

                            ctx.stroke();
                        }


                        //________________CHART__0

                        if (scope.numberChart === 1) {

                            ctx.beginPath();

                            ctx.lineWidth = spx * 3;
                            ctx.strokeStyle = '#315EA0';
                            ctx.lineCap = "butt"; // несглаживание концов линии

                            var begW = bigHatchStep;

                            //рисую график
                            for (var i = 0; i < scope.slots.length; i++) {
                                ctx.moveTo(begW, 0);
                                ctx.lineTo(begW, -scope.slots[i].f * 25 * 8 * bigHatchStep);
                                begW += bigHatchStep;
                            }

                            ctx.stroke();
                        }

                        //ctx.translate(0.5,0.5);
                        //ctx.restore();
                    }

                }

                //__________________________EVENTS______________________________

                scope.$watch('numberChart', function () {
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
