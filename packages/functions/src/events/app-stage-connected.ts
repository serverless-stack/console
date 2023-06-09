import { provideActor } from "@console/core/actor";
import { Stage } from "@console/core/app/stage";
import { AWS } from "@console/core/aws";
import { EventHandler } from "sst/node/event-bus";

export const handler = EventHandler(Stage.Events.Connected, async (evt) => {
  provideActor(evt.metadata.actor);
  await Stage.syncMetadata(evt.properties.stageID);
});
