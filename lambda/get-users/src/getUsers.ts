import AWS from "aws-cdk";
const dynamoClient = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME || "";

const hander = async (event, context) => {
  try {
    const params = {
      TableName: TABLE_NAME,
    };
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

export default hander;
