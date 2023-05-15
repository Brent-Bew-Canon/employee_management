const mysql = require('mysql2');

// Connection to access mysql database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'fY-6^uC-2^wK-9)eW-9^hZ-6(',
    database: 'management'
});

module.exports = connection;