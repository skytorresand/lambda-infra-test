import { LambdaIntegration, MethodLoggingLevel, RestApi } from "aws-cdk-lib/aws-apigateway";
import { StackData } from "../stack";
import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export class LambdaInfraStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    //Dynamo DB Tables
    const usersTable = new Table(this, "usersTableDynamo", {
      tableName: "users",
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
    });

    //Api Gateway
    const restApi = new RestApi(this, "UsersRestApi", {
      restApiName: "usersApi",
      deployOptions: {
        metricsEnabled: true,
        loggingLevel: MethodLoggingLevel.ERROR,
        dataTraceEnabled: true,
      },
      cloudWatchRole: true,
    });

    //Base Resource
    const baseResource = restApi.root.addResource("/");

    //Lambda Functions
    const getUsersFunction = new Function(this, "getUsersFunction", {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset("lambda/get-users/src"),
      handler: "get-users.handler",
    });
    usersTable.grantReadData(getUsersFunction);
    baseResource.addMethod("GET", new LambdaIntegration(getUsersFunction));

    const postUserFunction = new Function(this, "postUserFunction", {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset("lambda/post-users/src"),
      handler: "post-users.handler",
    });
    usersTable.grantReadWriteData(getUsersFunction);
    baseResource.addMethod("GET", new LambdaIntegration(getUsersFunction));

    //Id resource
    const idResources = baseResource.addResource(":id");

    const getUserFunction = new Function(this, "getUserFunction", {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset("lambda/get-users/src"),
      handler: "get-users.handler",
    });
    usersTable.grantReadData(getUsersFunction);
    idResources.addMethod("GET", new LambdaIntegration(getUserFunction));

    const updateUserFunction = new Function(this, "updateUserFunction", {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset("lambda/update-users/src"),
      handler: "update-users.handler",
    });
    usersTable.grantReadWriteData(getUsersFunction);
    idResources.addMethod("PATCH", new LambdaIntegration(updateUserFunction));

    //Delete User Function
    const deleteUserFunction = new Function(this, "deleteUserFunction", {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset("lambda/delete-users/src"),
      handler: "delete-users.handler",
    });
    usersTable.grantReadWriteData(getUsersFunction);
    idResources.addMethod("DELETE", new LambdaIntegration(deleteUserFunction));
  }
}
