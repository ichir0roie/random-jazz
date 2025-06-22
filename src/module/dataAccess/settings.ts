import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();

export type SettingsType = Schema["Settings"]["type"];

/**
 * Get setting by key
 */
export const getSettingByKey = async (
  key: string
): Promise<SettingsType | null> => {
  try {
    const { data: settings } = await client.models.Settings.list({
      filter: { key: { eq: key } },
    });

    return settings.length > 0 ? settings[0] : null;
  } catch (error) {
    console.error("Error getting setting by key:", error);
    throw error;
  }
};

/**
 * Get setting value by key
 */
export const getSettingValueByKey = async (key: string): Promise<string> => {
  try {
    const setting = await getSettingByKey(key);
    return setting?.value ?? "";
  } catch (error) {
    console.error("Error getting setting value by key:", error);
    throw error;
  }
};

/**
 * Update setting value by key
 */
export const updateSettingByKey = async (
  key: string,
  value: string
): Promise<SettingsType | null> => {
  try {
    const existingSetting = await getSettingByKey(key);

    if (!existingSetting) {
      return null;
    }

    const { data: updatedSetting } = await client.models.Settings.update({
      id: existingSetting.id,
      value,
    });

    return updatedSetting;
  } catch (error) {
    console.error("Error updating setting by key:", error);
    throw error;
  }
};
