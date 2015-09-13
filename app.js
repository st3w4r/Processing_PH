var Promise = require('bluebird');
var request = require('request');
var async   = require('async');

var db      = require('./db.js');
var api     = require('./api.js');

db.connect();

db.query('SELECT * FROM users');


api.requestGet('/v1/users?newer=0&per_page=50')
    .then(function(res) {
        if (res[0].statusCode != 200)
            throw 'HTTP Code: ' + res[0].statusCode + ' \nResponse: ' + res[1];
        return res[1];
    })
    .catch(function(err){
        console.log('Error:');
        console.log(err);
    })
    .then(function(data){
        var obj = JSON.parse(data);
        var arrUsers = obj.users;
        var objSave = {};

        async.each(arrUsers, function(user, callback) {
            //Prepare OBJ
            objSave['id'] = user.id;
            objSave['name'] = user.name;
            objSave['headline'] = user.headline;
            objSave['created_at'] = user.created_at;
            objSave['username'] = user.username;
            objSave['website_url'] = user.website_url;
            objSave['image_url_original'] = user.image_url.original;
            objSave['profile_url'] = user.profile_url;

            //Save in DB
            db.insert('INSERT INTO users SET ?', objSave);
            callback();
        }, function(err){
            //END
            db.end();

            if (err)
                return console.log(err);
        });
    });
