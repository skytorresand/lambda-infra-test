import AWS from "aws-cdk";
const dynamoClient = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME || "";

const hander = async (event, context) => {
  try {
    const body = JSON.parse(event.body);

    const params = {
      TableName: TABLE_NAME,
      Item: {
        userId: body.userId,
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

export default hander;
