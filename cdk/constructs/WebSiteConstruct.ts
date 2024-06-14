import { CfnOutput, Fn } from "aws-cdk-lib";
import { Construct } from "constructs";
import { BucketConstruct } from "./Bucket";
import { DistributionConstruct } from "./Distribution";
import { DeploymentConstruct } from "./Deployment";

export class WebSiteConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const bucketConstruct = new BucketConstruct(this, "WebSiteBucket");
    const distributionConstruct = new DistributionConstruct(
      this,
      "WebSiteDistribution",
      { bucket: bucketConstruct.bucket }
    );

    bucketConstruct.allowDistrbution(distributionConstruct.distributionArn);

    const deploymentConstruct = new DeploymentConstruct(
      this,
      "WebSiteDeployment",
      {
        bucket: bucketConstruct.bucket,
        distribution: distributionConstruct.webDistribution,
      }
    );

    new CfnOutput(this, "S3BucketUrl", {
      value: bucketConstruct.bucket.bucketWebsiteUrl,
    });

    new CfnOutput(this, "CloudFrontUrl", {
      value: distributionConstruct.webDistribution.distributionDomainName,
    });

    new CfnOutput(this, "DeploymentKeys", {
      value: Fn.join(",", deploymentConstruct.deployment.objectKeys),
    });
  }
}
