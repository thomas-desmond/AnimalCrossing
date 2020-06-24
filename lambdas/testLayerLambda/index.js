const dbConnectionService = require('/opt/dbConnectionService');

exports.handler = (event, context, callback) => {
    console.log('this is the dbConnectionService', dbConnectionService);

    const sqlQuery = 'SELECT * FROM Test';
    const sqlParams = [];

    dbConnectionService.executeQuery(sqlQuery, sqlParams, (sqlError, sqlResults) => {
        console.log('sqlError, sqlResults', sqlError, sqlResults);
        callback(sqlError, sqlResults);
    });
};