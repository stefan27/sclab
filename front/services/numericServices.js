﻿define(['app-conf', 'ajaxService'/*, 'ngRoute'*/], function(app) {

    app.register.service('numericService', ['ajaxService', function(ajaxService) {

        this.importScheds = function(successFunction, errorFunction) {
            ajaxService.AjaxGet("/api/scheds/ImportScheds", successFunction, errorFunction);
        };

        //get doctor, patients, meets
        this.sched4doctor = function(query, successFunction, errorFunction) {
            ajaxService.AjaxGetWithData(query, "/rest/get/sched4doctor", successFunction, errorFunction);
        };

        //get doctors, patients
        this.sched4clerk = function(query, successFunction, errorFunction) {
            ajaxService.AjaxGetWithData(query, "/rest/get/sched4clerk", successFunction, errorFunction);
        };

        //create patients
        this.createSched = function(sched, successFunction, errorFunction) {
            //originally
            //ajaxService.AjaxPost(customer, "/api/customers/CreateCustomer", successFunction, errorFunction);
            ajaxService.AjaxPost(sched, "/rest/post/sched", successFunction, errorFunction);
        };

        this.updateSched = function(sched, successFunction, errorFunction) {
            //ajaxService.AjaxPost(customer, "/api/customers/UpdateCustomer", successFunction, errorFunction);
            ajaxService.AjaxPost(sched, "/rest/put/sched/:id", successFunction, errorFunction);
        };

        //get patient by id
        this.getMeets = function(schedID, successFunction, errorFunction) {
            //originally
            //ajaxService.AjaxGetWithData(customerID, "/api/customers/GetCustomer", successFunction, errorFunction);
            ajaxService.AjaxGetWithData(schedID, "/rest/get/sched/:id", successFunction, errorFunction);
        };

        //remove patient by id
        this.removeSched = function(schedID, successFunction, errorFunction) {
            //originally
            //ajaxService.AjaxGetWithData(customerID, "/api/customers/GetCustomer", successFunction, errorFunction);
            ajaxService.AjaxGetWithData(schedID, "/rest/del/sched", successFunction, errorFunction);
        };

    }]);

});