var server = require("./server");

var router = require("./routers/nodeRouter");

var graphicController = require("./handlers/graphicController");
var dataController = require("./handlers/dataController");

var handle = {};

handle["/rest/get/data"] = dataController.data;
handle["/rest/get/graphic/lab2"] = graphicController.graphicLab2;
handle["/rest/get/graphic/lab3"] = graphicController.graphicLab3;
/*handle["/rest/get/sched4doctor"] = schedsController.sched4doctor;
handle["/rest/get/sched/:id"] = schedsController.getMeetsById;
handle["/rest/put/sched/:id"] = schedsController.update;
handle["/rest/post/sched"] = schedsController.create;
handle["/rest/del/sched"] = schedsController.remove;

*/

handle["/rest/get/data"] = dataController.data;
handle["/rest/get/loadlab"] = dataController.loadlab;

server.start(router.route, handle);
