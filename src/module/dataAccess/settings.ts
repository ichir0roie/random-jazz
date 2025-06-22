import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();

export type SettingsType = Schema["Settings"]["type"];

const getSettingObjectByKey = async (
  key: string
): Promise<SettingsType | null> => {
  console.log("getSettingObjectByKey", key);
  const { errors, data: settings } = await client.models.Settings.list({
    filter: { key: { eq: key } },
    authMode: "userPool",
  });
  if (errors) {
    throw errors;
  }

  return settings.length > 0 ? settings[0] : null;
};

const createSettingByKey = async (
  key: string,
  value: string
): Promise<string> => {
  console.log("createSettingByKey", key, value);

  const { errors, data: newSetting } = await client.models.Settings.create(
    {
      key: key,
      value: value,
    },
    { authMode: "userPool" }
  );
  if (errors) {
    throw errors;
  }

  return newSetting?.value ?? "";
};

export const getSettingValueByKey = async (key: string): Promise<string> => {
  const setting = await getSettingObjectByKey(key);
  return setting?.value ?? "";
};

export const updateSettingByKey = async (
  key: string,
  value: string
): Promise<string> => {
  console.log("updateSettingByKey", key, value);
  const existingSetting = await getSettingObjectByKey(key);

  if (!existingSetting) {
    const re = await createSettingByKey(key, value);
    return re;
  }

  const { errors, data: updatedSetting } = await client.models.Settings.update(
    {
      id: existingSetting.id,
      value: value,
    },
    { authMode: "userPool" }
  );
  if (errors) {
    throw errors;
  }

  return updatedSetting?.value ?? "";
};
