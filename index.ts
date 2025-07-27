import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// Load config from ESC
const appConfig = new pulumi.Config("appConfig"); // Reads from values.appConfig
const applicationName = appConfig.require("applicationName");
const message = appConfig.require("message");
const profileName = appConfig.require("profileName");

const rootConfig = new pulumi.Config(); // Reads non-namespaced values
const favoriteColor = rootConfig.require("FavoriteColor");
const environmentName = rootConfig.require("environmentName");

// Just for demonstration
console.log("FavoriteColor:", favoriteColor);
console.log("AppConfig Application Name:", applicationName);
console.log("Message:", message);
console.log("Profile Name:", profileName);
console.log("Environment Name:", environmentName);

// Example: Use these values to create AppConfig resources
const app = new aws.appconfig.Application("my-app", {
  name: applicationName,
});

const env = new aws.appconfig.Environment("my-env", {
  applicationId: app.id,
  name: environmentName,
});

const profile = new aws.appconfig.ConfigurationProfile("my-profile", {
  applicationId: app.id,
  name: profileName,
  locationUri: "hosted",
});

// Create hosted configuration version using the message
const configVersion = new aws.appconfig.HostedConfigurationVersion("my-config-version", {
  applicationId: app.id,
  configurationProfileId: profile.id,
  content: pulumi.interpolate`{"message": "${message}"}`,
  contentType: "application/json",
});

// Export values to verify
export const selectedColor = favoriteColor;
export const selectedMessage = message;
