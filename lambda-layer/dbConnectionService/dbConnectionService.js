const mysql = require('mysql');

const dbConstants = require('./databaseConstants');

function executeQuery(sql, params, callback) {
    const connection = mysql.createConnection({
        host: dbConstants.host,
        user: dbConstants.username,
        password: dbConstants.password,
        database: dbConstants.database
    });

    connection.query(sql, params, (sqlError, sqlResults) => {
        connection.end();
        callback(sqlError, sqlResults);
    });
}

module.exports = {
    executeQuery: executeQuery
};
