define(['app-conf'], function (app) {

    app.register.service('ajaxService', ['$http', /*'blockUI',*/ function ($http/*, blockUI*/) {

        this.AjaxPost = function (data, route, successFunction, errorFunction) {
            $('#exec').css('display', 'block');

            setTimeout(function () {
                $http.post(route, data).success(function (response, status, headers, config) {
                    $('#exec').css('display', 'none');
                    successFunction(response, status);
                }).error(function (response) {
                    $('#exec').css('display', 'none');
                    errorFunction(response);
                });
            }, 1000);

        };

        this.AjaxGetWithData = function (data, route, successFunction, errorFunction) {
            $('#exec').css('display', 'block');

            setTimeout(function () {
                $http({
                    method: 'GET',
                    url: route,
                    params: data
                }).success(function (response, status, headers, config) {
                    $('#exec').css('display', 'none');
                    successFunction(response, status);
                }).error(function (response) {
                    $('#exec').css('display', 'none');
                    errorFunction(response);
                });
            }, 1000);

        };

        /*this.AjaxPostWithNoAuthenication = function(data, route, successFunction, errorFunction) {
         alert('start');
         setTimeout(function() {
         $http.post(route, data).success(function(response, status, headers, config) {
         alert('stop');
         successFunction(response, status);
         }).error(function(response) {
         alert('stop');
         errorFunction(response);
         });
         }, 1000);

         }*/

        /*this.AjaxGet = function(route, successFunction, errorFunction) {

         alert('start');
         setTimeout(function() {
         $http({
         method: 'GET',
         url: route
         }).success(function(response, status, headers, config) {
         alert('stop');
         successFunction(response, status);
         }).error(function(response) {
         alert('stop');

         errorFunction(response);
         });
         }, 1000);

         }*/


        /*this.AjaxGetWithNoBlock = function(data, route, successFunction, errorFunction) {
         setTimeout(function() {
         $http({
         method: 'GET',
         url: route,
         params: data
         }).success(function(response, status, headers, config) {
         successFunction(response, status);
         }).error(function(response) {;

         errorFunction(response);
         });
         }, 0);

         }*/

    }]);
});
