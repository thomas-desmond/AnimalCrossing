const cognitoServices = require('./services/cognito.service')
const waterfall = require('async-waterfall');

exports.handler = (event, context, callback) => {
    
    const cognitoToken = event.body.token;

    const tasks = [
        (taskComplete) => cognitoServices.checkIfTokenValid(cognitoToken, taskComplete),
        (taskComplete) => cognitoServices.parseToken(cognitoToken, taskComplete)
    ];

    waterfall(tasks, (error, result) => {
        callback(error, result)
    });
};