import {
  AppConfigDataClient,
  StartConfigurationSessionCommand,
  GetLatestConfigurationCommand,
} from "@aws-sdk/client-appconfigdata";

const client = new AppConfigDataClient({ region: "us-east-1" });

(async () => {
  const session = await client.send(
    new StartConfigurationSessionCommand({
      ApplicationIdentifier: "hello-pulumi-app",
      EnvironmentIdentifier: "dev",
      ConfigurationProfileIdentifier: "hello-profile",
    })
  );

  const config = await client.send(
    new GetLatestConfigurationCommand({
      ConfigurationToken: session.InitialConfigurationToken!,
    })
  );

  console.log("Returned config:", new TextDecoder().decode(config.Configuration!));
})();
