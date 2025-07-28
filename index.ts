import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();
const applicationName = config.require("applicationName");
const message = config.require("message");
const profileName = config.require("profileName");
const environmentName = config.require("environmentName");

const app = new aws.appconfig.Application("my-app", { name: applicationName });

const env = new aws.appconfig.Environment("my-env", {
  applicationId: app.id,
  name: environmentName,
});

const profile = new aws.appconfig.ConfigurationProfile("my-profile", {
  applicationId: app.id,
  name: profileName,
  locationUri: "hosted",
});

const configVersion = new aws.appconfig.HostedConfigurationVersion("my-config-version", {
  applicationId: app.id,
  configurationProfileId: profile.configurationProfileId,
  content: pulumi.interpolate`{"message": "${message}"}`,
  contentType: "application/json",
});

new aws.appconfig.Deployment("my-deployment", {
  applicationId: app.id,
  configurationProfileId: profile.configurationProfileId,
  configurationVersion: configVersion.versionNumber.apply((v) => v.toString()),
  deploymentStrategyId: "AppConfig.AllAtOnce", // ✅ Hardcoded built-in strategy
  environmentId: env.environmentId,
});

export const selectedMessage = message;
