const { randomUUID } = require("crypto");
const AWS = require("aws-sdk");
const dynamoClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);

    const params = {
      TableName: "users",
      Item: {
        userId: randomUUID(),
        firstname: body.firstname,
        lastname: body.lastname,
      },
    };
    const user = await dynamoClient.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        user,
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
