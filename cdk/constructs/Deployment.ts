import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Distribution } from "aws-cdk-lib/aws-cloudfront";
import { Construct } from "constructs";

type DeploymentProps = {
  bucket: Bucket;
  distribution: Distribution;
};

export class DeploymentConstruct extends Construct {
  public readonly deployment: BucketDeployment;

  constructor(scope: Construct, id: string, props: DeploymentProps) {
    super(scope, id);

    this.deployment = new BucketDeployment(this, "WebSiteDeployment", {
      sources: [Source.asset("./dist")],
      destinationBucket: props.bucket,
      distribution: props.distribution,
      distributionPaths: ["/*"],
    });
  }
}
