import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";

const client = generateClient<Schema>();

export type TracksType = Schema["Tracks"]["type"];

export const createTrack = async (
  trackNumber: number,
  title?: string,
  skip?: boolean,
  count?: number
): Promise<TracksType> => {
  const { data: newTrack, errors } = await client.models.Tracks.create(
    {
      trackNumber,
      title,
      skip: skip ?? false,
      count: count ?? 0,
    },
    { authMode: "userPool" }
  );

  if (errors) {
    console.error(errors);
    throw errors;
  }
  if (!newTrack) {
    throw new Error("Failed to create track");
  }

  return newTrack;
};

export const readTracks = async (
  trackNumber: number | null = null
): Promise<TracksType[]> => {
  const { data: tracks, errors } = await client.models.Tracks.list({
    filter: trackNumber ? { trackNumber: { eq: trackNumber } } : undefined,
    authMode: "userPool",
  });

  if (errors) {
    console.error(errors);
    throw errors;
  }

  return tracks;
};

export const readSkipTracks = async (): Promise<TracksType[]> => {
  const { data: tracks, errors } = await client.models.Tracks.list({
    filter: {
      skip: { eq: true },
    },
    authMode: "userPool",
  });

  if (errors) {
    console.error(errors);
    throw errors;
  }

  return tracks;
};

export const updateTrack = async (
  id: string,
  trackNumber?: number,
  title?: string,
  skip?: boolean,
  count?: number
): Promise<TracksType> => {
  const { data: updatedTrack, errors } = await client.models.Tracks.update(
    {
      id,
      trackNumber,
      title,
      skip,
      count,
    },
    { authMode: "userPool" }
  );

  if (errors) {
    console.error(errors);
    throw errors;
  }
  if (!updatedTrack) {
    throw new Error("Failed to update track");
  }

  return updatedTrack;
};
