var Promise     = require('bluebird');
var mysql       = require('mysql');

var connection = Promise.promisifyAll(mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: 'root',
    database: 'PH'
}));

exports.connect = function() {
    connection.connect(function(err) {
        if (err) { return console.log('Connection DB ERROR:'); console.log(err);}
        console.log('Connection DB OK');
    });
};

exports.query = function(query) {
    connection.query(query, function(err, row, fields){
        console.log(row);
    });
}

exports.insert = function(query, data) {
    console.log(query);
    console.log(data);
    connection.queryAsync(query, data)
        .then(function(result){
            console.log('Insert OK:');
        })
        .catch(function(err){
            console.log('Insert ERROR:');
            console.log(err);
        });
        // if (err) { return console.log('Insert ERROR:'); console.log(err); }
}

exports.end = function(err) {
    connection.end(function(err) {
        if (err) { return console.log('End DB ERROR:'); }
        console.log('End DB OK');
    });
};

exports.connection = connection;
