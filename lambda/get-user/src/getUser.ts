import AWS from "aws-cdk";
const dynamoClient = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME || "";

const hander = async (event, context) => {
  try {
    const body = JSON.parse(event.body);

    const params = {
      TableName: TABLE_NAME,
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

export default hander;
