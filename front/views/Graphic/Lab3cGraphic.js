"use strict";

define(['app-conf', 'graphicService', 'three'], function (app) {

    app.register.controller('Lab3cGraphic', ['$scope', '$rootScope', '$location', 'graphicService',
        function ($scope, $rootScope, $location, graphicService) {

            $scope.img = {};

            $scope.initializeController = function () {
                graphicService.graphicLab3({}, $scope.graphicLab3Completed, $scope.graphicLab3Error);
            }

            $scope.graphicLab3Completed = function (res, status) {
                $scope.links = JSON.parse(res.links);

            }

            $scope.graphicLab3Error = function (res, status) {
                alert('error');
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
                        scope.img.obj = element[0];
                    })
                })
            }

        }
    });

    app.register.directive('lab3', function ($timeout) {
        return {
            scope: {
                img: '='
            },
            restrict: 'A',

            link: function (scope, element, attr) {

                element[0].width = 758;
                element[0].height = 500;

                var w = element[0].width;
                var h = element[0].height;
                var ctx = element[0].getContext("2d");

                var coord = {};
                var delta = {};
                var click = false;
                var slider = {
                    x: 200,
                    y: 200
                };
                var wSlider = 50;
                var hSlider = 20;


                //__________________________DRAW______________________________

                function draw() {

                    ctx.clearRect(0, 0, w, h);

                    //__________________________IMAGE______________________________

                    if (scope.img && scope.img.obj && scope.img.obj != undefined) {
                        scope.img.obj.width = 200;
                        ctx.drawImage(scope.img.obj, 0, 0);

                        //var Y = 0;
                        //var data = 0;

                        //for (var i = 0; i < data.data.length; i += 4) {
                        //    Y = 0.222 * data.data[i] + 0.707 * data.data[i + 1] +
                        //        0.071 * data.data[i + 2];
                        //    data.data[i] = Y;
                        //    data.data[i + 1] = Y;
                        //    data.data[i + 2] = Y;
                        //}

                        //ctx.putImageData(data, lena.offsetWidth + 10, 0);
                        //lena.style.display = 'none';
                    }

                    //__________________________SLIDER______________________________

                    if (click) {
                        slider.x = coord.x - delta.x;
                        slider.y = coord.y - delta.y;
                    }

                    ctx.beginPath();
                    ctx.moveTo(20, 20);
                    ctx.lineTo(60, 20);
                    ctx.lineWidth = 4;
                    ctx.strokeStyle = 'rgb(225,225,225)';
                    ctx.stroke();

                    ctx.beginPath();
                    canvasRadius(slider.x + 0.5, slider.y + 0.5, wSlider, hSlider, 5, 5, 5, 5);
                    ctx.closePath();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = 'rgba(171,171,171,0.75)';
                    ctx.fillStyle = 'rgba(171,171,171,0.75)';
                    ctx.fill();
                    ctx.stroke();

                    //__________________________TEXT______________________________

                    ctx.font = "16px Roboto-Condensed";
                    ctx.fillStyle = 'rgb(100,100,100)';

                    if (coord.x !== undefined || coord.y !== undefined) {
                        ctx.fillText('  COORD: ' + coord.x + ' ' + coord.y, 5, 20);
                    }
                }

                scope.$watch('img.obj', function () {
                    $timeout(function () {
                        draw();
                    });
                });

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

                    if (coord.x !== undefined && coord.y !== undefined &&
                        coord.x > slider.x && coord.x < slider.x + wSlider &&
                        coord.y > slider.y && coord.y < slider.y + hSlider) {

                        delta.x = coord.x - slider.x;
                        delta.y = coord.y - slider.y;
                        click = true;
                        draw();
                    }
                });

                element.bind('mouseup', function (e) {

                    if (click) {
                        click = false;
                        draw();
                    }
                });

                draw();

            }
        }
    }); //end Directive


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


});
