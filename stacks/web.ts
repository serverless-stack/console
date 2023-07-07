import { StackContext, StaticSite, use } from "sst/constructs";
import { API } from "./api";
import { Auth } from "./auth";
import { DNS } from "./dns";
import { Realtime } from "./realtime";

export function Web({ stack }: StackContext) {
  const dns = use(DNS);
  const api = use(API);
  const auth = use(Auth);
  const realtime = use(Realtime)

  const workspace = new StaticSite(stack, "workspace", {
    path: "./packages/web/workspace",
    buildOutput: "./dist",
    buildCommand: "pnpm build",
    customDomain: {
      domainName: "console." + dns.domain,
      hostedZone: dns.zone,
    },
    environment: {
      VITE_API_URL: api.customDomainUrl || api.url,
      VITE_AUTH_URL: auth.url,
      VITE_IOT_HOST: realtime.endpointAddress,
      VITE_STAGE: stack.stage,
    },
  });

  stack.addOutputs({
    WorkspaceUrl: workspace.customDomainUrl,
    Output: "31",
  });
}
