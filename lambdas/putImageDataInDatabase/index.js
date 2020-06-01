const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
 
exports.handler = (event, context, callback) => {
    dynamodb.putItem({
        TableName: "animal-crossing",
        Item: {
            "image-guid": {
                S: event.imageGuid
            },
            "user-id": {
                S: event.userId
            }
        }
    }, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            callback(null, {
                statusCode: '500',
                body: err
            });
        } else {
            callback(null, {
                statusCode: '200',
                body: 'putItem Success'
            });
        }
    })
};