var Promise = require('bluebird');
var https = require('https');

https.globalAgent.maxSockets = 5;

var request = Promise.promisifyAll(require('request'));
// var request = require('request');
var config = require('./config.js');

var options = {
    url: config.apiHost,
    method: 'GET',
    headers: {
        'Authorization' : 'Bearer ' + config.apiToken,
        'Accpect': 'application/json'
    }
};

var optionsHttps = {
    host: config.apiHost,
    port: 443,
    path: null,
    headers: {
        'Authorization' : 'Bearer ' + config.apiToken,
        'Accpect': 'application/json'
    }
};

// var baseRequest = request.defaults(options);

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


exports.requestGetHttps = function(endPoint) {
    optionsHttps['path'] = endPoint;
    return new Promise(function(resolve, reject) {
        https.get(optionsHttps, function(res) {
        var pageData = "";

        res.resume();
        res.on('data', function (chunk) {
            if(res.statusCode == 200){
                pageData +=chunk;
            }
        });

        res.on('end', function() {
            resolve(pageData);
        });
        }).on('error', function(err) {
           console.log("Error: " + options.host + "\n" + e.message);
            reject(e);
        });
    });
};


// exports.requestGetHttps = function(endPoint) {
//     optionsHttps['path'] = endPoint;
//     https.get(optionsHttps, function(res) {
//         var pageData = "";
//
//         res.resume();
//         res.on('data', function (chunk) {
//             if(res.statusCode == 200){
//                 pageData +=chunk;
//             }
//         });
//
//         res.on('end', function() {
//             console.log(pageData);
//             // console.log("finish to fetch id: "+options.pageId);
//         });
//     }).on('error', function(e) {
//        console.log("Error: " + options.host + "\n" + e.message);
//     });
// };

/*
exports.requestGetNoPromise = function(endPoint) {
    options['url'] += endPoint;
    var specialRequest = baseRequest.defaults(options)
    specialRequest.get(options, function(err, res, body){
        console.log(body);
    })
        // .then(function (res) {
        //     return res;
        // })
        // .catch(function (err) {
        //     console.log('Request ERROR:');
        //     console.log(err);
        // });
};
*/
