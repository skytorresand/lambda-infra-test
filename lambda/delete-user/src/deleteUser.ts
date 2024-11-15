import { DynamoDeleteItem, DynamoDeleteItemProps } from "./../../../node_modules/aws-cdk-lib/aws-stepfunctions-tasks/lib/dynamodb/delete-item.d";
import { APIGatewayProxyEvent, Context, Handler } from "aws-lambda";
import * as AWS from "aws-sdk";
const dynamoClient = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.TABLE_NAME || "";

interface Body {
  userId: string;
}

const hander: Handler = async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    const body: Body = JSON.parse(event.body || "");

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
