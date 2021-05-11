const mysql = require('mysql');

function getConnection(){
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "hellothere",
        database:"280_test"

    });
    return con;
}

module.exports.getConnection = getConnection;