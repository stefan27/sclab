var mongoose = require('mongoose');
//mongoose.set('debug', true);
var config = require('./lib/config');
var log = require('./lib/log')(module);
var async = require('async');
var q = require('q');

var ObjectId = mongoose.Types.ObjectId;
var L = console.log;

if (!module.parent) {
    mongoose.connect(config.get('mongoose:uri'));
}

var db = mongoose.connection;
var models = mongoose.models;

async.series([
    openDb,
    dropDb,
    requireModels,
    createModels1,
    createModels2,
    //createModels3,
    //createModels4,
    //work1

], function (err, res) {
    if (!module.parent) {
        mongoose.disconnect();
    }
})

function openDb(cb) {
    if (!module.parent) {
        db.on('open', cb);
        log.info('mongoose: open Database');
    } else {
        cb();
    }
}

function dropDb(cb) {
    db.db.dropDatabase(cb);
    log.info('mongoose: drop Database');
}

function requireModels(cb) {
    require('./models/itemModel');
    require('./models/labModel');
    require('./models/fullLabModel');
    require('./models/graphicModel');

    async.each(Object.keys(mongoose.models), function (modelName, cb) {
        mongoose.models[modelName].ensureIndexes(cb);
    }, cb);

    log.info('mongoose: require Models');
}
/*
var items = [{
    name: 'Teorver'
}, {
    name: 'Numeric'
}, {
    name: 'Database'
}, {
    name: 'Graphic'
}, {
    name: 'Web'
}, {
    name: 'Cluster'
}
];*/


function createModels1(cb) {

    var items = [{
        name: 'Teorver'
    }, {
        name: 'Numeric'
    }, {
        name: 'Database'
    }, {
        name: 'Graphic'
    }, {
        name: 'Web'
    }, {
        name: 'Cluster'
    }
    ];

    var fullLabs = [
        {
            nameItem: 'Teorver',
            name: 'Lab1',
            topic: 'Оценивание параметров распределений'
        }, {
            nameItem: 'Teorver',
            name: 'Lab2',
            topic: 'Методы построения оценок'
        }, {
            nameItem: 'Teorver',
            name: 'Lab3',
            topic: 'Проверка гипотез о параметрах нормального распределения'
        }, {
            nameItem: 'Teorver',
            name: 'Lab4',
            topic: 'Критерий хи-квадрат'
        }, {
            nameItem: 'Teorver',
            name: 'Lab5',
            topic: 'Непараметричиские критерии'
        }, {
            nameItem: 'Numeric',
            name: 'Lab1',
            topic: 'Методи розв’язування нелінійних рівнянь'
        }, {
            nameItem: 'Numeric',
            name: 'Lab2',
            topic: 'Методи розв’язання систем лінійних алгебраїчних рівнянь'
        }, {
            nameItem: 'Numeric',
            name: 'Lab3',
            topic: 'Методи наближення функцій'
        }, {
            nameItem: 'Numeric',
            name: 'Lab4',
            topic: 'Численные методы одномерной оптимизации'
        }, {
            nameItem: 'Graphic',
            name: 'Lab1',
            topic: 'Знакомство с растровыми графическими форматами'
        }, {
            nameItem: 'Graphic',
            name: 'Lab2',
            topic: 'Сжатие изображений',
            task: 'https://vk.com/club42643648?w=wall-42643648_5986%2Fall'
        }, {
            nameItem: 'Graphic',
            name: 'Lab3',
            topic: 'По элементная(по пиксельная) обработка изображения',
            task: 'http://vk.com/club42643648?w=wall-42643648_6023%2Fall'
        }, {
            nameItem: 'Graphic',
            name: 'Lab4',
            task: 'http://vk.com/club42643648?w=wall-42643648_6028%2Fall'
        }, {
            nameItem: 'Cluster',
            name: 'Lab1',
            link: '#/Cluster/Lab1'
        }, {
            nameItem: 'Cluster',
            name: 'Lab2',
            link: '#/Cluster/Lab2'
        }, {
            nameItem: 'Cluster',
            name: 'Lab3',
            link: '#/Cluster/Lab3'
        }
    ];

    var graphicLab2s = [{
        str: 'First Example!'
    }, {
        str: 'Second Example!'
    }, {
        str: 'Third Example!'
    }, {
        str: 'Fouth Example!'
    }, {
        str: 'Fifth Example!'
    }
    ];

    var graphicLab3s = [{
        link: './Views/Graphic/img/girl1.jpg'
    }, {
        link: './Views/Graphic/img/girl2.jpg'
    }, {
        link: './Views/Graphic/img/lena.jpg'
    }
    ];

    async.parallel([
            function (cb) {
                async.each(items, function (itemData, cb) {
                    var item = new models.Item(itemData);
                    item.save(cb);
                }, cb);
            },
            function (cb) {
                async.each(fullLabs, function (fullLabData, cb) {
                    var fullLab = new models.FullLab(fullLabData);
                    fullLab.save(cb);
                }, cb);
            },
            function (cb) {
                async.each(graphicLab2s, function (graphicLab2Data, cb) {
                    var graphicLab2 = new models.GraphicLab2(graphicLab2Data);
                    graphicLab2.save(cb);
                }, cb);
            },
            function (cb) {
                async.each(graphicLab3s, function (graphicLab3Data, cb) {
                    var graphicLab3 = new models.GraphicLab3(graphicLab3Data);
                    graphicLab3.save(cb);
                }, cb);
            }
        ],
        function (err, res) {
            cb();
        });

    log.info('mongoose: create items/labs');
}

function createModels2(cb) {

    var items = [{
        name: 'Teorver'
    }, {
        name: 'Numeric'
    }, {
        name: 'Graphic'
    }, {
        name: 'Cluster'
    }];

    async.each(items, function (item, cb) {
        bindItem(item.name, cb);
    }, cb);

    function bindItem(item, cb) {

        async.waterfall([
            function (cb) {
                models.FullLab.find({
                    nameItem: item
                }).exec(function (err, resFullLab) {
                    cb(null, resFullLab);
                });
            },
            function (resFullLab, cb) {
                models.Item.find({
                    name: item
                })
                    .limit(1)
                    .exec(function (err, resItem) {
                        cb(null, resFullLab, resItem);
                    });
            }
        ], function (err, resFullLab, resItem) {

            async.each(resFullLab, function (fullLab, cb) {
                resItem[0].labs.push({
                    name: fullLab.name,
                    labId: fullLab._id
                });
            }, cb);

            resItem[0].save(cb);
        });
    }

    log.info('mongoose: binding items+labs');
    log.info('mongoose: Start');
}
