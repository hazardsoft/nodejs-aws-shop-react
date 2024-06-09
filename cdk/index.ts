import { App, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { WebSiteConstruct } from "./constructs/WebSiteConstruct";

class WebSiteStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new WebSiteConstruct(this, "WebSiteConstruct");
  }
}

new WebSiteStack(new App(), "WebSiteStack");
