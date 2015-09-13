var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));

var config = require('./config.js');

var options = {
    url: config.apiHost,
    method: 'GET',
    headers: {
        'Authorization' : 'Bearer ' + config.apiToken,
        'Accpect': 'application/json'
    }
};

exports.requestGet = function(endPoint) {
    options['url'] += endPoint;
    return request.getAsync(options)
        .then(function (res) {
            return res;
        })
        .catch(function (err) {
            console.log('Request ERROR:');
            console.log(err);
        });
};
