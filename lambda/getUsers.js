const AWS = require("aws-sdk");
const dynamoClient = new AWS.DynamoDB.DocumentClient();

const params = {
  TableName: "users",
};

exports.handler = async (event, context) => {
  try {
    const data = await dynamoClient.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        users: data,
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
