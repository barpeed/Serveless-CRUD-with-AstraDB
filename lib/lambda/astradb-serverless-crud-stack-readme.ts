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
        ASTRA_DB_ID: "<YOUR_ASTRADB_ID>",
        ASTRA_DB_REGION: "<REGION_ASTRADB>",
        ASTRA_DB_KEYSPACE: "<KEYSAPCE>",
        ASTRA_DB_APPLICATION_TOKEN: "<APP_TOKEN>",
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
