const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'test'
});

module.exports = connection;