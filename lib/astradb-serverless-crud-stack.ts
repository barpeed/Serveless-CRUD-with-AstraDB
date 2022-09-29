import { Stack, StackProps, Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { join } from 'path';
import {
  Code,
  Function,
  FunctionUrlAuthType,
  HttpMethod,
  Runtime,
} from 'aws-cdk-lib/aws-lambda';

export class AstradbServerlessCrudStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const webhook_function = new NodejsFunction(this, 'get-data-service', {
      environment: {
        ASTRA_DB_ID: "654ac4ea-46ae-4ec5-8086-4d4509b89125",
        ASTRA_DB_REGION: "us-east1",
        ASTRA_DB_KEYSPACE: "hgr",
        ASTRA_DB_APPLICATION_TOKEN: "AstraCS:axHGumsLDlUvJHmhgYrMLWjh:2f19bc0f07fecf1016eda0ad0783f77fcfa1b6806aa04548eadac8e65db78b76",
      },
      entry: join(__dirname, "lambda", "index.ts"),
      runtime: Runtime.NODEJS_16_X,
      logRetention: RetentionDays.ONE_WEEK,
      currentVersionOptions: {
        removalPolicy: RemovalPolicy.DESTROY,
      }, 
    });

    webhook_function.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
      cors: {
          allowedMethods: [HttpMethod.GET, HttpMethod.POST],
          allowedOrigins: ['*'],
          maxAge: Duration.minutes(1),
      },

    });
  }
}
