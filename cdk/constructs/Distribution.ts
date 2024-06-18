import { Bucket } from "aws-cdk-lib/aws-s3";
import { CloudFrontToS3 } from "@aws-solutions-constructs/aws-cloudfront-s3";
import {
  Distribution,
  PriceClass,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";

type DistributionProps = {
  bucket: Bucket;
};

export class DistributionConstruct extends Construct {
  public readonly webDistribution: Distribution;
  public readonly distributionArn: string;

  constructor(scope: Construct, id: string, props: DistributionProps) {
    super(scope, id);

    const distribution = new CloudFrontToS3(this, "CloudFrontDistribution", {
      existingBucketObj: props.bucket,
      cloudFrontDistributionProps: {
        defaultBehavior: {
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        defaultRootObject: "index.html",
        enableLogging: false,
        priceClass: PriceClass.PRICE_CLASS_100,
      },
      insertHttpSecurityHeaders: false,
      responseHeadersPolicyProps: {
        securityHeadersBehavior: {
          contentSecurityPolicy: {
            contentSecurityPolicy: `style-src 'unsafe-inline'; object-src 'none'`,
            override: true,
          },
        },
      },
      logS3AccessLogs: false,
    });
    // define policies how to handle resources in case of stack destruction
    distribution.cloudFrontWebDistribution.applyRemovalPolicy(
      RemovalPolicy.DESTROY
    );
    distribution.originAccessControl?.applyRemovalPolicy(RemovalPolicy.DESTROY);

    this.webDistribution = distribution.cloudFrontWebDistribution;

    this.distributionArn = `arn:aws:cloudfront::${this.webDistribution.stack.account}:distribution/${this.webDistribution.distributionId}`;
  }
}
