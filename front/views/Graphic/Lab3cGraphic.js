"use strict";

define(['app-conf', 'graphicService', 'three'], function (app) {

    app.register.controller('Lab3cGraphic', ['$scope', '$rootScope', '$location', 'graphicService',
        function ($scope, $rootScope, $location, graphicService) {

            $scope.img = {};

            $scope.imgData = {};


            $scope.initializeController = function () {
                $scope.sliders = {};

                $scope.sliders.sliderGrayPos = {
                    x: 20,
                    y: 43
                };

                $scope.sliders.sliderGrayChange = {
                    min: 22,
                    max: 62
                };

                $scope.sliders.sliderInvertPos = {
                    x: 20,
                    y: 103
                };

                $scope.sliders.sliderInvertChange = {
                    min: 22,
                    max: 62
                };

                $scope.sliders.sliderRPos = {
                    x: 180,
                    y: 138
                };

                $scope.sliders.sliderRChange = {
                    min: 47,
                    max: 302
                };

                $scope.sliders.sliderGPos = {
                    x: 180,
                    y: 163
                };

                $scope.sliders.sliderGChange = {
                    min: 47,
                    max: 302
                };

                $scope.sliders.sliderBPos = {
                    x: 180,
                    y: 188
                };

                $scope.sliders.sliderBChange = {
                    min: 47,
                    max: 302
                };

                graphicService.graphicLab3({}, $scope.graphicLab3Completed, $scope.graphicLab3Error);
            }

            $scope.graphicLab3Completed = function (res, status) {
                $scope.links = JSON.parse(res.links);

            }

            $scope.graphicLab3Error = function (res, status) {

            }

        }]);  //endController

    app.register.directive('clickImg', function () {
        return {
            scope: {
                img: '='
            },
            restrict: 'A',

            link: function (scope, element, attr) {

                element.bind('click', function () {
                    scope.$apply(function () {
                        scope.img.img = element[0];
                    })
                })
            }
        }
    });


    app.register.directive('pic', function ($timeout) {
        return {
            scope: {
                img: '=',
                imgData: '=',
                sliders: '='
            },
            restrict: 'A',

            link: function (scope, element, attrs) {

                element[0].width = 300;
                element[0].height = 400;

                var w = element[0].width;
                var h = element[0].height;
                var ctx = element[0].getContext("2d");


                //__________________________DRAW______________________________

                function draw() {

                    ctx.clearRect(0, 0, w, h);

                    //__________________________IMAGE______________________________

                    if (scope.img && scope.img.img) {
                        ctx.drawImage(scope.img.img, 0, 0);
                        scope.imgData.data = ctx.getImageData(0, 0, 300, 400);

                        //Полутоновое изображение
                        if (scope.sliders.sliderGrayPos.x == scope.sliders.sliderGrayChange.max) {
                            var Y = 0;

                            for (var i = 0; i < scope.imgData.data.data.length; i += 4) {
                                Y = 0.222 * scope.imgData.data.data[i] + 0.707 * scope.imgData.data.data[i + 1] +
                                    0.071 * scope.imgData.data.data[i + 2];
                                scope.imgData.data.data[i] = Y;
                                scope.imgData.data.data[i + 1] = Y;
                                scope.imgData.data.data[i + 2] = Y;
                            }
                        }

                        //Инверсия
                        if (scope.sliders.sliderInvertPos.x == scope.sliders.sliderInvertChange.max) {

                            for (var i = 0; i < scope.imgData.data.data.length; i += 4) {
                                scope.imgData.data.data[i] = 255 - scope.imgData.data.data[i];
                                scope.imgData.data.data[i + 1] = 255 - scope.imgData.data.data[i + 1];
                                scope.imgData.data.data[i + 2] = 255 - scope.imgData.data.data[i + 2];
                            }
                        }

                        //изменение каналов RGB
                        for (var i = 0; i < scope.imgData.data.data.length; i += 4) {
                            scope.imgData.data.data[i] += scope.sliders.sliderRPos.x - 180;
                            scope.imgData.data.data[i + 1] += scope.sliders.sliderGPos.x - 180;
                            scope.imgData.data.data[i + 2] += scope.sliders.sliderBPos.x - 180;
                        }


                        ctx.putImageData(scope.imgData.data, 0, 0);
                    }

                }

                scope.$watch('img.img', function () {
                    $timeout(function () {
                        draw();
                    });
                });

                scope.$watch('sliders', function () {
                    $timeout(function () {
                        draw();
                    });
                }, true);


                draw();

            }
        }
    }); //end Directive

    app.register.directive('slider', function ($timeout) {
        return {
            scope: {
                sliders: '='
            },
            restrict: 'A',

            link: function (scope, element, attr) {

                element[0].width = 450;
                element[0].height = 400;

                var w = element[0].width;
                var h = element[0].height;
                var ctx = element[0].getContext("2d");

                var coord = {};
                var delta = {};

                var sliderGrayClick = false;

                var sliderGraySize = {
                    w: 30,
                    h: 13
                };

                var sliderInvertClick = false;

                var sliderInvertSize = {
                    w: 30,
                    h: 13
                };

                var sliderRClick = false;

                var sliderRSize = {
                    w: 30,
                    h: 13
                };

                var sliderGClick = false;

                var sliderGSize = {
                    w: 30,
                    h: 13
                };

                var sliderBClick = false;

                var sliderBSize = {
                    w: 30,
                    h: 13
                };

                function draw() {

                    ctx.clearRect(0, 0, w, h);

                    ctx.font = "16px Roboto-Condensed";
                    ctx.fillStyle = 'rgb(100,100,100)';

                    if (coord.x !== undefined || coord.y !== undefined) {
                        ctx.fillText('  COORD: ' + coord.x + ' ' + coord.y, w - 125, h - 375);
                    }

                    //__________________________GRAY______________________________

                    ctx.font = "14px Consolas";
                    ctx.fillStyle = '#333333';

                    ctx.fillText('Преобразование в полутоновое:', 20, 25);

                    if (scope.sliders.sliderGrayPos.x == scope.sliders.sliderGrayChange.min) {
                        ctx.fillText('DISABLED', 110, 54);
                    } else if (scope.sliders.sliderGrayPos.x == scope.sliders.sliderGrayChange.max) {
                        ctx.fillText('ENABLED', 110, 54);
                    }

                    if (sliderGrayClick) {
                        if ((coord.x - delta.x) > scope.sliders.sliderGrayChange.min && (coord.x - delta.x) < scope.sliders.sliderGrayChange.max) {
                            scope.sliders.sliderGrayPos.x = coord.x - delta.x;
                        }
                    }

                    ctx.beginPath();
                    ctx.moveTo(25, 50);
                    ctx.lineTo(90, 50);
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = 'rgb(225,225,225)';
                    ctx.stroke();

                    ctx.beginPath();
                    canvasRadius(scope.sliders.sliderGrayPos.x + 0.5, scope.sliders.sliderGrayPos.y + 0.5, sliderGraySize.w, sliderGraySize.h, 5, 5, 5, 5);
                    ctx.closePath();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = 'rgba(171,171,171,0.75)';
                    ctx.lineCap = 'round';
                    ctx.fillStyle = 'rgba(171,171,171,0.75)';
                    ctx.fill();
                    ctx.stroke();


                    //__________________________INVERT______________________________

                    ctx.font = "14px Consolas";
                    ctx.fillStyle = '#333333';

                    ctx.fillText('Инвертирование:', 20, 85);

                    if (scope.sliders.sliderInvertPos.x == scope.sliders.sliderInvertChange.min) {
                        ctx.fillText('DISABLED', 110, 114);
                    } else if (scope.sliders.sliderInvertPos.x == scope.sliders.sliderInvertChange.max) {
                        ctx.fillText('ENABLED', 110, 114);
                    }

                    if (sliderInvertClick) {
                        if ((coord.x - delta.x) > scope.sliders.sliderInvertChange.min && (coord.x - delta.x) < scope.sliders.sliderInvertChange.max) {
                            scope.sliders.sliderInvertPos.x = coord.x - delta.x;
                        }
                    }

                    ctx.beginPath();
                    ctx.moveTo(25, 110);
                    ctx.lineTo(90, 110);
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = 'rgb(225,225,225)';
                    ctx.stroke();

                    ctx.beginPath();
                    canvasRadius(scope.sliders.sliderInvertPos.x + 0.5, scope.sliders.sliderInvertPos.y + 0.5, sliderInvertSize.w, sliderInvertSize.h, 5, 5, 5, 5);
                    ctx.closePath();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = 'rgba(171,171,171,0.75)';
                    ctx.lineCap = 'round';
                    ctx.fillStyle = 'rgba(171,171,171,0.75)';
                    ctx.fill();
                    ctx.stroke();

                    //__________________________R______________________________

                    ctx.font = "14px Consolas";
                    ctx.fillStyle = '#333333';

                    ctx.fillText('R:', 20, 148);

                    ctx.fillText(scope.sliders.sliderRPos.x - 180, 335, 150);

                    if (sliderRClick) {
                        if ((coord.x - delta.x) > scope.sliders.sliderRChange.min && (coord.x - delta.x) < scope.sliders.sliderRChange.max) {
                            scope.$apply(function () {
                                scope.sliders.sliderRPos.x = coord.x - delta.x;
                            });
                        }
                    }

                    ctx.beginPath();
                    ctx.moveTo(50, 145);
                    ctx.lineTo(330, 145);
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = 'rgb(225,225,225)';
                    ctx.stroke();

                    ctx.beginPath();
                    canvasRadius(scope.sliders.sliderRPos.x + 0.5, scope.sliders.sliderRPos.y + 0.5, sliderRSize.w, sliderRSize.h, 5, 5, 5, 5);
                    ctx.closePath();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = 'rgba(171,171,171,0.75)';
                    ctx.lineCap = 'round';
                    ctx.fillStyle = 'rgba(171,171,171,0.75)';
                    ctx.fill();
                    ctx.stroke();

                    //__________________________G______________________________

                    ctx.font = "14px Consolas";
                    ctx.fillStyle = '#333333';

                    ctx.fillText('G:', 20, 170);

                    ctx.fillText(scope.sliders.sliderGPos.x - 180, 335, 174);

                    if (sliderGClick) {
                        if ((coord.x - delta.x) > scope.sliders.sliderGChange.min && (coord.x - delta.x) < scope.sliders.sliderGChange.max) {
                            scope.$apply(function () {
                                scope.sliders.sliderGPos.x = coord.x - delta.x;
                            });
                        }
                    }

                    ctx.beginPath();
                    ctx.moveTo(50, 170);
                    ctx.lineTo(330, 170);
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = 'rgb(225,225,225)';
                    ctx.stroke();

                    ctx.beginPath();
                    canvasRadius(scope.sliders.sliderGPos.x + 0.5, scope.sliders.sliderGPos.y + 0.5, sliderGSize.w, sliderGSize.h, 5, 5, 5, 5);
                    ctx.closePath();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = 'rgba(171,171,171,0.75)';
                    ctx.lineCap = 'round';
                    ctx.fillStyle = 'rgba(171,171,171,0.75)';
                    ctx.fill();
                    ctx.stroke();

                    //__________________________B______________________________

                    ctx.font = "14px Consolas";
                    ctx.fillStyle = '#333333';

                    ctx.fillText('B:', 20, 195);

                    ctx.fillText(scope.sliders.sliderBPos.x - 180, 335, 199);

                    if (sliderBClick) {
                        if ((coord.x - delta.x) > scope.sliders.sliderBChange.min && (coord.x - delta.x) < scope.sliders.sliderBChange.max) {
                            scope.$apply(function () {
                                scope.sliders.sliderBPos.x = coord.x - delta.x;
                            });
                        }
                    }

                    ctx.beginPath();
                    ctx.moveTo(50, 195);
                    ctx.lineTo(330, 195);
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = 'rgb(225,225,225)';
                    ctx.stroke();

                    ctx.beginPath();
                    canvasRadius(scope.sliders.sliderBPos.x + 0.5, scope.sliders.sliderBPos.y + 0.5, sliderBSize.w, sliderBSize.h, 5, 5, 5, 5);
                    ctx.closePath();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = 'rgba(171,171,171,0.75)';
                    ctx.lineCap = 'round';
                    ctx.fillStyle = 'rgba(171,171,171,0.75)';
                    ctx.fill();
                    ctx.stroke();




                    //__________________________RESET______________________________

                    //ctx.font = "14px Consolas";
                    //ctx.fillStyle = '#333333';
                    //
                    //ctx.fillText('B:', 20, 195);


                    //if (sliderBClick) {
                    //    if ((coord.x - delta.x) > scope.sliders.sliderBChange.min && (coord.x - delta.x) < scope.sliders.sliderBChange.max) {
                    //        scope.$apply(function () {
                    //            scope.sliders.sliderBPos.x = coord.x - delta.x;
                    //        });
                    //    }
                    //}
                    //
                    //ctx.beginPath();
                    //canvasRadius(w-65 + 0.5, 40 + 0.5, 42, 20, 5, 5, 5, 5);
                    //ctx.closePath();
                    //ctx.lineWidth = 1;
                    //ctx.strokeStyle = 'rgba(171,171,171,0.75)';
                    //ctx.lineCap = 'round';
                    //ctx.fillStyle = 'rgba(171,171,171,0.75)';
                    //ctx.fill();
                    //ctx.stroke();
                }

                scope.$watch('sliders', function () {
                    $timeout(function () {
                        draw();
                    });
                }, true);

                function canvasRadius(x, y, w, h, tl, tr, br, bl) {
                    var r = x + w, b = y + h;

                    ctx.moveTo(x + tl, y);
                    ctx.lineTo(r - (tr), y);
                    ctx.quadraticCurveTo(r, y, r, y + tr);
                    ctx.lineTo(r, b - br);
                    ctx.quadraticCurveTo(r, b, r - br, b);
                    ctx.lineTo(x + bl, b);
                    ctx.quadraticCurveTo(x, b, x, b - bl);
                    ctx.lineTo(x, y + tl);
                    ctx.quadraticCurveTo(x, y, x + tl, y);

                }

                element.bind('mousemove', function (e) {
                    var rect = element[0].getBoundingClientRect();
                    coord.x = e.clientX - rect.left;
                    coord.y = e.clientY - rect.top;
                    draw();
                });

                element.bind('mousedown', function (e) {

                        if (coord.x !== undefined && coord.y !== undefined) {
                            if (coord.x > scope.sliders.sliderGrayPos.x &&
                                coord.x < scope.sliders.sliderGrayPos.x + sliderGraySize.w &&
                                coord.y > scope.sliders.sliderGrayPos.y &&
                                coord.y < scope.sliders.sliderGrayPos.y + sliderGraySize.h) {

                                delta.x = coord.x - scope.sliders.sliderGrayPos.x;
                                delta.y = coord.y - scope.sliders.sliderGrayPos.y;
                                sliderGrayClick = true;
                                draw();
                            }
                            else if (coord.x > scope.sliders.sliderInvertPos.x &&
                                coord.x < scope.sliders.sliderInvertPos.x + sliderInvertSize.w &&
                                coord.y > scope.sliders.sliderInvertPos.y &&
                                coord.y < scope.sliders.sliderInvertPos.y + sliderInvertSize.h) {

                                delta.x = coord.x - scope.sliders.sliderInvertPos.x;
                                delta.y = coord.y - scope.sliders.sliderInvertPos.y;
                                sliderInvertClick = true;
                                draw();
                            }
                            else if (coord.x > scope.sliders.sliderRPos.x &&
                                coord.x < scope.sliders.sliderRPos.x + sliderRSize.w &&
                                coord.y > scope.sliders.sliderRPos.y &&
                                coord.y < scope.sliders.sliderRPos.y + sliderRSize.h) {

                                delta.x = coord.x - scope.sliders.sliderRPos.x;
                                delta.y = coord.y - scope.sliders.sliderRPos.y;
                                sliderRClick = true;
                                draw();
                            }
                            else if (coord.x > scope.sliders.sliderGPos.x &&
                                coord.x < scope.sliders.sliderGPos.x + sliderGSize.w &&
                                coord.y > scope.sliders.sliderGPos.y &&
                                coord.y < scope.sliders.sliderGPos.y + sliderGSize.h) {

                                delta.x = coord.x - scope.sliders.sliderGPos.x;
                                delta.y = coord.y - scope.sliders.sliderGPos.y;
                                sliderGClick = true;
                                draw();
                            }
                            else if (coord.x > scope.sliders.sliderBPos.x &&
                                coord.x < scope.sliders.sliderBPos.x + sliderBSize.w &&
                                coord.y > scope.sliders.sliderBPos.y &&
                                coord.y < scope.sliders.sliderBPos.y + sliderBSize.h) {

                                delta.x = coord.x - scope.sliders.sliderBPos.x;
                                delta.y = coord.y - scope.sliders.sliderBPos.y;
                                sliderBClick = true;
                                draw();
                            }
                            //else if (coord.x > resetPos.x &&
                            //    coord.x < resetPos.x + sliderBSize.w &&
                            //    coord.y > scope.sliders.sliderBPos.y &&
                            //    coord.y < scope.sliders.sliderBPos.y + sliderBSize.h) {
                            //
                            //    delta.x = coord.x - scope.sliders.sliderBPos.x;
                            //    delta.y = coord.y - scope.sliders.sliderBPos.y;
                            //    sliderBClick = true;
                            //    draw();
                            //}



                            //w-65 + 0.5, 40 + 0.5, 42, 20,
                        }
                    }
                )
                ;

                element.bind('mouseup', function (e) {

                    if (sliderGrayClick) {
                        sliderGrayClick = false;
                        if (scope.sliders.sliderGrayPos.x < (scope.sliders.sliderGrayChange.max + scope.sliders.sliderGrayChange.min) / 2) {

                            scope.$apply(function () {
                                scope.sliders.sliderGrayPos.x = scope.sliders.sliderGrayChange.min;
                            })
                        }
                        else if (scope.sliders.sliderGrayPos.x >= (scope.sliders.sliderGrayChange.max + scope.sliders.sliderGrayChange.min) / 2) {

                            scope.$apply(function () {
                                scope.sliders.sliderGrayPos.x = scope.sliders.sliderGrayChange.max;
                            })
                        }
                        draw();
                    }
                    else if (sliderInvertClick) {
                        sliderInvertClick = false;
                        if (scope.sliders.sliderInvertPos.x < (scope.sliders.sliderInvertChange.max + scope.sliders.sliderInvertChange.min) / 2) {

                            scope.$apply(function () {
                                scope.sliders.sliderInvertPos.x = scope.sliders.sliderInvertChange.min;
                            })
                        }
                        else if (scope.sliders.sliderInvertPos.x >= (scope.sliders.sliderInvertChange.max + scope.sliders.sliderInvertChange.min) / 2) {

                            scope.$apply(function () {
                                scope.sliders.sliderInvertPos.x = scope.sliders.sliderInvertChange.max;
                            })
                        }
                        draw();
                    }
                    else if (sliderRClick) {
                        sliderRClick = false;
                        draw();
                    }
                    else if (sliderGClick) {
                        sliderGClick = false;
                        draw();
                    }
                    else if (sliderBClick) {
                        sliderBClick = false;
                        draw();
                    }


                });

                draw();

            }
        }
    })
    ; //end Directive


    /*app.register.service('SceneService', function () {
     return {
     scene: new THREE.Scene()
     }
     });

     app.register.service('CameraService', function () {
     return {
     perspectiveCam: new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
     }
     });

     app.register.service('CubeService', ['SceneService', function (SceneService) {

     var cubeGeometry = new THREE.CubeGeometry(30, 30, 30);
     var cubeMaterial = new THREE.MeshBasicMaterial({
     map: THREE.ImageUtils.loadTexture('./static/box.jpg')
     //color: 0xf1f1f1
     });
     var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
     cube.rotation.x = -0.42 * Math.PI;
     cube.position.x = 0;
     cube.position.y = 0;
     cube.position.z = 0;
     SceneService.scene.add(cube);

     this.yRotateCube = function () {
     cube.rotation.y += 0.02;
     cube.rotation.z += 0.02;
     };


     }]);


     app.register.directive('threeViewport', ['SceneService', 'CameraService', 'CubeService', function (SceneService, CameraService, CubeService) {
     return {
     restrict: "A",
     scope: {},

     link: function (scope, element) {
     var renderer;
     //var angularSpeed = 0.2;
     //var lastTime = 0;
     //var controls;

     function init() {

     CameraService.perspectiveCam.position.set(0, 0, 80);
     SceneService.scene.add(CameraService.perspectiveCam);

     renderer = new THREE.WebGLRenderer();
     renderer.setClearColor(0xffffff, 1.0);

     renderer.setSize(element[0].clientWidth, element[0].clientHeight);

     element[0].appendChild(renderer.domElement);
     }


     function render() {
     //var time = (new Date()).getTime();
     //var timeDiff = time - lastTime;
     //var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
     CubeService.yRotateCube();
     //lastTime = time;

     requestAnimationFrame(render);
     renderer.render(SceneService.scene, CameraService.perspectiveCam);
     //controls.update();
     }

     init();
     render();


     }
     }
     }
     ]);*/


})
;
