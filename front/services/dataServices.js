define(['app-conf', 'ajaxService'], function (app) {

    app.register.service('dataService', ['ajaxService', function (ajaxService) {

        this.data = function(query, successFunction, errorFunction) {
            ajaxService.AjaxGetWithData(query, "/rest/get/data", successFunction, errorFunction);
        };

        this.loadlab = function(query, successFunction, errorFunction) {
            ajaxService.AjaxGetWithData(query, "/rest/get/loadlab", successFunction, errorFunction);
        };


    }]);
});