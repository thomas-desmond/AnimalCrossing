const adminLambdas = [];


const getPolicy = function (principalId, resource, cognitoUserData) {
    const adminResource = adminLambdas.some(lambdaName => {
        return resource.includes(lambdaName)
    })
    if (adminResource) {
        if (cognitoUserData['groups'] === "Admin_User") {
            return generateAllow(principalId, resource, cognitoUserData)
        }
        return generateDeny(principalId, resource, cognitoUserData)
    }
    return generateAllow(principalId, resource, cognitoUserData)
}

const generateAllow = function (principalId, resource, cognitoUserData) {
    return generatePolicy(principalId, 'Allow', resource, cognitoUserData);
}

const generateDeny = function (principalId, resource) {
    return generatePolicy(principalId, 'Deny', resource);
}

const generatePolicy = function (principalId, effect, resource, cognitoUserData) {
    // Required output:
    var authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17'; // default version
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; // default action
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    // Optional output with custom properties of the String, Number or Boolean type.
    authResponse.context = cognitoUserData;
    return authResponse;
}


module.exports = {
    genaratePolicy: (resource, cognitoData, callback) => {
        callback(null, getPolicy('me', resource, cognitoData))
    }
}


