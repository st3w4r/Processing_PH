var Promise = require('bluebird');
var request = require('request');
var async   = require('async');

var db      = require('./db.js');
var api     = require('./api.js');

db.connect();

// db.query('SELECT * FROM users');

var nbRequest = 2;
var idStart = 310016;
var perPage = 50;
var i = 0;

async.whilst(function(){
    return i < nbRequest;
}, function(next) {

    api.requestGetHttps('/v1/users?newer=' + idStart + '&per_page=' + perPage)
        .then(function(res) {
            // if (res[0].statusCode != 200)
                // throw 'HTTP Code: ' + res[0].statusCode + ' \nResponse: ' + res[1];
            // console.log(res);
            return res;
        })
        .catch(function(err){
            console.log('Error:');
            console.log(err);
        })
        .then(function(data){
            var obj = JSON.parse(data);
            var arrUsers = obj.users;
            var objSave = {};

            var req = '/v1/users?newer=' + idStart + '&per_page=' + perPage;
            var objResponse = {request: req, response: data };

            db.insert('INSERT INTO responses SET ?', objResponse);
            if (arrUsers.length == 0)
                end();
            for(user in arrUsers) {
                console.log('User id: ' + arrUsers[user].id);
                //Prepare OBJ
                objSave['id'] = arrUsers[user].id;
                objSave['name'] = arrUsers[user].name;
                objSave['headline'] = arrUsers[user].headline;
                objSave['created_at'] = arrUsers[user].created_at;
                objSave['username'] = arrUsers[user].username;
                objSave['website_url'] = arrUsers[user].website_url;
                objSave['image_url_original'] = arrUsers[user].image_url.original;
                objSave['profile_url'] = arrUsers[user].profile_url;

                //Save in DB
                db.insert('INSERT INTO users SET ?', objSave)
            }
            return true;
        })
        .then(function(){
            i++;
            idStart = idStart + perPage;
            next();
        });

}, function(err){
    if (err) { console.log('Error:'); console.log(err);}
    console.log('ALL PROCESSED');
    db.end();
});

function end(){
    console.log('USERS EMPTY');
    db.end();
}
