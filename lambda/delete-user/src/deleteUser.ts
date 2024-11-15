import AWS from "aws-cdk";
const dynamoClient = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME || "";

const hander = async (event, context) => {
  try {
    const body = JSON.parse(event.body);

    var params = {
      TableName: TABLE_NAME,
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

export default hander;
