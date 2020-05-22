exports.handler = (event, context, callback) => {
    const userDate = {
        userName: event.cognitoData.userName,
        email: event.cognitoData.email,
        email_verified: event.cognitoData.email_verified === 'true'
    }
    callback(null, userDate);
};