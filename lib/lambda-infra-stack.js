import { LambdaIntegration, MethodLoggingLevel, RestApi } from "aws-cdk-lib/aws-apigateway";
import { stackData } from "../stack.js";
import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export class LambdaInfraStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    let dynamo = [];
    let lambda = [];
    let gateway = [];

    //Dynamo DB Tables
    stackData.dynamo.forEach((item) => {
      dynamo.push(
        new Table(this, item.name, {
          tableName: item.tableName,
          partitionKey: {
            name: item.partitionKey.name,
            type: AttributeType[item.partitionKey.type],
          },
        })
      );
    });

    //Api Gateway
    stackData.gateway.forEach((item) => {
      const api = new RestApi(this, item.name, {
        restApiName: item.name,
        deployOptions: {
          metricsEnabled: item.deployOptions.metricsEnabled,
          loggingLevel: MethodLoggingLevel[item.deployOptions.loggingLevel],
          dataTraceEnabled: item.deployOptions.dataTraceEnabled,
        },
        cloudWatchRole: item.deployOptions.cloudWatchRole,
      });

      gateway.push(api);
    });

    //Lambda functions
    stackData.lambda.forEach((item) => {
      const fnc = new Function(this, item.name, {
        runtime: Runtime[item.runtime],
        code: Code.fromAsset("lambda"),
        handler: item.handler,
      });

      item.permissions.forEach((permission) => {
        const table = dynamo.find((itm) => itm.tableName == permission.tableName);

        switch (permission.grant) {
          case "R":
            table.grantReadData(fnc);
            break;
          case "RW":
            table.grantReadWriteData(fnc);
            break;
          default:
            return;
        }
      });

      const api = gateway.find((itm) => itm.name == item.gateway);

      const [base, endpoint] = item.path;

      const resource = api.root.addResource(base);

      if (endpoint == undefined) {
        resource.addMethod(item.method, new LambdaIntegration(fnc));
      } else if (endpoint) {
        const deepResource = resource.addResource(endpoint);
        deepResource.addMethod(item.method, new LambdaIntegration(fnc));
      }

      lambda.push(fnc);
    });
  }
}
