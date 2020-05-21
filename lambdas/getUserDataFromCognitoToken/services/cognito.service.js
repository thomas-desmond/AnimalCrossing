const promisify = require('util');
const Axios = require('axios');
const jsonwebtoken = require('jsonwebtoken');

const jwkToPem = require('jwk-to-pem');
const cognitoPoolId = 'us-east-1_cEdncg42A'
const cognitoIssuer = `https://cognito-idp.us-east-1.amazonaws.com/${cognitoPoolId}`;

const getPublicKeys = (callback) => {
    const url = `${cognitoIssuer}/.well-known/jwks.json`;

    Axios.default.get(url).then((publicKeys) => {
        const keys = publicKeys.data.keys.reduce((agg, current) => {
            const pem = jwkToPem(current);
            agg[current.kid] = { instance: current, pem };
            return agg;
        }, {})
        callback(keys)
    });

}

module.exports = {
    checkIfTokenValid: (cognitoToken, callback) => {
        const tokenSection = cognitoToken.split('.');
        const error = (!cognitoToken || tokenSection.length < 2) ? 'requested token is invalid' : null;
        callback(error);
    },

    parseToken: (token, callback) => {
        const tokenSections = token.split('.');
        let result = {};

        try {
            const headerJSON = Buffer.from(tokenSections[0], 'base64').toString('utf8');
            const header = JSON.parse(headerJSON);

            getPublicKeys((keys) => {
                const key = keys[header.kid];
                if (key === undefined) {
                    throw new Error('claim made for unknown kid');
                }
                promisify.promisify(jsonwebtoken.verify.bind(jsonwebtoken))(token, key.pem).then((claim) => {

                    const currentSeconds = Math.floor((new Date()).valueOf() / 1000);
                    if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
                        throw new Error('claim is expired or invalid');
                    }
                    if (claim.iss !== cognitoIssuer) {
                        throw new Error('claim issuer is invalid');
                    }
                    if (claim.token_use !== 'id') {
                        throw new Error('claim use is not id');
                    }

                    result['userName'] = claim['cognito:username'];
                    result['email'] = claim['email'];
                    result['sub'] = claim['sub'];
                    result['emailIsVerified'] = claim['email_verified'];
                    result['groups'] = claim['cognito:groups'][0];

                    callback(null, result)
                });

            });

        }
        catch (error) {
            callback(null, result)
        }
    }
}