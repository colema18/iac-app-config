import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();
const applicationName = config.require("applicationName");
const message = config.require("message");
const profileName = config.require("profileName");
const logo = config.require("logo");
const bgColor = config.require("bgColor");

const environmentName = new pulumi.Config().require("environmentName");

const app = new aws.appconfig.Application("hello-pulumi-app", { name: applicationName });

const env = new aws.appconfig.Environment("hello-pulumi-env", {
  applicationId: app.id,
  name: environmentName,
});

const profile = new aws.appconfig.ConfigurationProfile("hello-pulumi-profile", {
  applicationId: app.id,
  name: profileName,
  locationUri: "hosted",
});

// Include message, logo, and bgColor in JSON
const configVersion = new aws.appconfig.HostedConfigurationVersion("hello-pulumi-config-version", {
  applicationId: app.id,
  configurationProfileId: profile.configurationProfileId,
  content: pulumi.interpolate`{
    "message": "${message}",
    "logo": "${logo}",
    "backgroundColor": "${bgColor}"
  }`,
  contentType: "application/json",
});

new aws.appconfig.Deployment("hello-pulumi-deployment", {
  applicationId: app.id,
  configurationProfileId: profile.configurationProfileId,
  configurationVersion: configVersion.versionNumber.apply((v) => v.toString()),
  deploymentStrategyId: "AppConfig.AllAtOnce",
  environmentId: env.environmentId,
});

export const selectedMessage = message;
