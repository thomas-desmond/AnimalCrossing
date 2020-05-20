"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const util_1 = require("util");
const Axios = __importStar(require("axios"));
const jsonwebtoken = __importStar(require("jsonwebtoken"));
const jwk_to_pem_1 = __importDefault(require("jwk-to-pem"));
const cognitoPoolId = process.env.COGNITO_POOL_ID || "";
if (!cognitoPoolId) {
    throw new Error("env var required for cognito pool");
}
const cognitoIssuer = `https://cognito-idp.us-east-1.amazonaws.com/${cognitoPoolId}`;
let cacheKeys;
const getPublicKeys = async () => {
    if (!cacheKeys) {
        const url = `${cognitoIssuer}/.well-known/jwks.json`;
        const publicKeys = await Axios.default.get(url);
        cacheKeys = publicKeys.data.keys.reduce((agg, current) => {
            const pem = jwk_to_pem_1.default(current);
            agg[current.kid] = { instance: current, pem };
            return agg;
        }, {});
        return cacheKeys;
    }
    else {
        return cacheKeys;
    }
};
const verifyPromised = util_1.promisify(jsonwebtoken.verify.bind(jsonwebtoken));
const handler = async (request) => {
    let result;
    try {
        console.log(`user claim verfiy invoked for ${JSON.stringify(request)}`);
        const token = request.token;
        const tokenSections = (token || "").split(".");
        if (tokenSections.length < 2) {
            throw new Error("requested token is invalid");
        }
        const headerJSON = Buffer.from(tokenSections[0], "base64").toString("utf8");
        const header = JSON.parse(headerJSON);
        const keys = await getPublicKeys();
        const key = keys[header.kid];
        if (key === undefined) {
            throw new Error("claim made for unknown kid");
        }
        const claim = (await verifyPromised(token, key.pem));
        const currentSeconds = Math.floor(new Date().valueOf() / 1000);
        if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
            throw new Error("claim is expired or invalid");
        }
        if (claim.iss !== cognitoIssuer) {
            throw new Error("claim issuer is invalid");
        }
        if (claim.token_use !== "access") {
            throw new Error("claim use is not access");
        }
        console.log(`claim confirmed for ${claim.username}`);
        result = {
            userName: claim.username,
            clientId: claim.client_id,
            isValid: true,
        };
    }
    catch (error) {
        result = { userName: "", clientId: "", error, isValid: false };
    }
    return result;
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsK0JBQWlDO0FBQ2pDLDZDQUErQjtBQUMvQiwyREFBNkM7QUFDN0MsNERBQWtDO0FBK0NsQyxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsSUFBSSxFQUFFLENBQUM7QUFDeEQsSUFBSSxDQUFDLGFBQWEsRUFBRTtJQUNsQixNQUFNLElBQUksS0FBSyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7Q0FDdEQ7QUFDRCxNQUFNLGFBQWEsR0FBRywrQ0FBK0MsYUFBYSxFQUFFLENBQUM7QUFFckYsSUFBSSxTQUEwQyxDQUFDO0FBQy9DLE1BQU0sYUFBYSxHQUFHLEtBQUssSUFBa0MsRUFBRTtJQUM3RCxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ2QsTUFBTSxHQUFHLEdBQUcsR0FBRyxhQUFhLHdCQUF3QixDQUFDO1FBQ3JELE1BQU0sVUFBVSxHQUFHLE1BQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQWEsR0FBRyxDQUFDLENBQUM7UUFDNUQsU0FBUyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUN2RCxNQUFNLEdBQUcsR0FBRyxvQkFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzlCLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQzlDLE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQyxFQUFFLEVBQXlCLENBQUMsQ0FBQztRQUM5QixPQUFPLFNBQVMsQ0FBQztLQUNsQjtTQUFNO1FBQ0wsT0FBTyxTQUFTLENBQUM7S0FDbEI7QUFDSCxDQUFDLENBQUM7QUFFRixNQUFNLGNB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