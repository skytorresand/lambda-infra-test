#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { LambdaInfraStack } from "../lib/lambda-infra-stack.ts";

const app = new cdk.App();
new LambdaInfraStack(app, "LambdaInfraStack", {});
