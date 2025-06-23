import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.guest()]),
  Settings: a
    .model({
      id: a.id().required(),
      key: a.string(),
      value: a.string(),
    })
    .identifier(["id"])
    .authorization((allow) => [allow.owner()]),
  Tracks: a
    .model({
      id: a.id().required(),
      trackNumber: a.integer().required(),
      title: a.string(),
      skip: a.boolean().default(false),
      count: a.integer().default(0),
    })
    .identifier(["id"])
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "identityPool",
  },
});
