const cognitoServices = require('./services/cognito.service')
const policyServices = require('./services/policy.service')
const waterfall = require('async-waterfall');

exports.handler = (event, context, callback) => {
    const resource = event.methodArn;
    const cognitoToken = event.authorizationToken;

    const tasks = [
        (taskComplete) => cognitoServices.checkIfTokenValid(cognitoToken, taskComplete),
        (taskComplete) => cognitoServices.parseToken(cognitoToken, taskComplete),
        (cognitoData, taskComplete) => policyServices.genaratePolicy(resource, cognitoData, taskComplete)
    ];

    waterfall(tasks, (error, policy) => {
        callback(error, policy)
    });
};

