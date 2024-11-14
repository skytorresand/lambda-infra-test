const AWS = require("aws-sdk");
const dynamoClient = new AWS.DynamoDB.DocumentClient();
exports.handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);

    var params = {
      TableName: "users",
      Key: {
        userId: body.userId,
      },
      ReturnValues: "ALL_OLD",
    };

    const data = await dynamoClient.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        user: data,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err,
      }),
    };
  }
};
