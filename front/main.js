

require.config({

    baseUrl: "/",

    // alias libraries paths
    paths: {
        'app-conf': 'app-conf',
        'jquery' : 'scripts/jquery-1.11.3',
        'angular': 'scripts/angular',
        'angular-route': 'scripts/angular-route',
        'angularAMD': 'scripts/angularAMD',


        'datgui': 'scripts/dat.gui',
        'stats': 'scripts/stats',
        'three': 'scripts/three',

        'highlight': 'scripts/highlight.pack',
        'angular-highlight': 'scripts/angular-highlightjs',

        'angular-css-injector': 'scripts/angular-css-injector',



        'ajaxService': 'services/AjaxServices',
        'alertsService': 'services/AlertsServices',

        'dataService': 'services/dataServices',
        'numericService': 'services/numericServices',
        'graphicService': 'services/graphicServices',
        'clusterService': 'services/clusterServices',





        'Lab2cCluster': 'views/Cluster/Lab2cCluster',
        'Lab3cCluster': 'views/Cluster/Lab3cCluster',
        'Lab2cGraphic': 'views/Graphic/Lab2cGraphic',
        'Lab3cGraphic': 'views/Graphic/Lab3cGraphic',
        'Lab1cNumeric': 'views/Numeric/Lab1cNumeric',
        'Lab2cNumeric': 'views/Numeric/Lab2cNumeric',
        'Lab3cSysanaliz': 'views/Sysanaliz/Lab3cSysanaliz',
        'Lab4cSysanaliz': 'views/Sysanaliz/Lab4cSysanaliz'




    },

    // Add angular modules that does not support AMD out of the box, put it in a shim
    shim: {
        'angularAMD': ['angular'],
        'angular-route': ['angular']

    },

    // kick start application
    deps: ['app-conf']
});
