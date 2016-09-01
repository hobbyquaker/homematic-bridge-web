var express = require('express');
var bodyParser = require('body-parser');
var app = express();

module.exports = function (hmbridge) {

    var that = this;


    var config = hmbridge.config.web || {};

    app.use(express.static(__dirname + '/www-src'));


    app.listen(config.port, function () {
        hmbridge.log.info('webserver listening on port', config.port);
    });

    app.get('/api/config', function (req, res) {
        res.send(hmbridge.config);
    });

    app.get('/api/status', function (req, res) {
        res.send(hmbridge.status);
    });

    app.use(bodyParser.json());

    app.post('/api/config', function (req, res) {
        hmbridge.log.debug('post api config', JSON.stringify(req.body));
        hmbridge.saveConfig(req.body);
        res.send('ok');
    });

    app.get('/api/restart', function (req, res) {
        res.send('ok');
        hmbridge.restart();
    });



    app.get('/api/plugins', function (req, res) {


        res.send(that.pluginList);
    });

    this.pluginList = [];

    this.setPlugins = function (p) {
        var plugins = Object.keys(p);
        plugins.splice(plugins.indexOf('hmbridge-web'), 1);
        plugins.forEach(function (plugin) {
            that.pluginList.push({name: plugin, title: p[plugin].title});
            app.use(express.static(__dirname + '../../' + plugin + '/www'));
        });
    }

    return this;

};




