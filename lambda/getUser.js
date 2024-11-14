const AWS = require("aws-sdk");
const dynamoClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);

    let params = {
      TableName: "users",
      Key: {
        userId: { S: body.userId },
      },
    };

    const data = await dynamoClient.getItem(params).promise();

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
