"use client";

import {
  Authenticator,
  Button,
  TextField,
  Flex,
  Text,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  getSettingValueByKey,
  updateSettingByKey,
} from "@/module/dataAccess/settings";

// https://docs.amplify.aws/nextjs/build-a-backend/server-side-rendering/nextjs-app-router-server-components/
import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";
import {
  readTracks,
  createTrack,
  updateTrack,
  readSkipTracks,
} from "@/module/dataAccess/tracks";
Amplify.configure(outputs);

function parseInt(value: string): number {
  if (value === "") {
    return 0;
  }
  const parsed = Number.parseInt(value, 10);
  return isNaN(parsed) ? 0 : parsed;
}

export default function App() {
  const [minValue, setMinValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(300);
  const [selectedNumber, setSelectedNumber] = useState<number>(0);
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    getSettingValueByKey("minValue").then((value) => {
      setMinValue(parseInt(value || "0"));
    });
    getSettingValueByKey("maxValue").then((value) => {
      setMaxValue(parseInt(value || "300"));
    });
    getSettingValueByKey("selectedNumber").then((value) => {
      setupTrack(parseInt(value));
    });
  }, []);

  async function generateRandomNumber() {
    if (minValue > maxValue) {
      return 0;
    }
    const tracks = await readSkipTracks();
    const numbers = tracks.map((track) => track.trackNumber);
    let count = 0;
    let randomNumber =
      Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    while (numbers.includes(randomNumber)) {
      // If the random number is already used, generate a new one
      randomNumber =
        Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
      count++;
      if (count > numbers.length) {
        throw new Error("Too many attempts to find a unique random number.");
      }
    }
    return randomNumber;
  }

  function onClickValue(
    key: string,
    v: string,
    setState: Dispatch<SetStateAction<number>>
  ) {
    const value = parseInt(v);
    setState(value);
    updateSettingByKey(key, v);
  }

  async function setupTrack(trackNumber: number) {
    setSelectedNumber(trackNumber);
    updateSettingByKey("selectedNumber", trackNumber.toString());
    const track = await readTracks(trackNumber);

    if (track.length <= 0) {
      setTitle("");
      return;
    }
    setTitle(track[0].title || "");
  }

  async function onClickGet() {
    const randomNumber = await generateRandomNumber();
    setupTrack(randomNumber);
  }

  async function onClickSkip() {
    const ex = await readTracks(selectedNumber);
    if (ex.length > 0) {
      const updatedTrack = await updateTrack(
        ex[0].id,
        selectedNumber,
        title,
        true
      );
      console.log("Updated track:", updatedTrack);
    } else {
      const newTrack = await createTrack(selectedNumber, title, true);
      console.log("Created new track:", newTrack);
    }

    onClickGet();
  }
  async function onClickRegister() {
    const ex = await readTracks(selectedNumber);
    if (ex.length > 0) {
      const updatedTrack = await updateTrack(
        ex[0].id,
        selectedNumber,
        title,
        false,
        ex[0].count ? ex[0].count + 1 : 1
      );
      console.log("Updated track:", updatedTrack);
    } else {
      const newTrack = await createTrack(selectedNumber, title, false);
      console.log("Created new track:", newTrack);
    }
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main
          style={{
            padding: "2rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Flex
            direction="column"
            gap="1.5rem"
            alignItems="center"
            maxWidth="600px"
            width="100%"
          >
            <Text fontSize="xl" fontWeight="bold">
              {user?.username || "ゲスト"}
            </Text>
            <Flex direction="row" gap="1rem" alignItems="center">
              <TextField
                label="min"
                value={minValue}
                onChange={(e) =>
                  onClickValue("minValue", e.target.value, setMinValue)
                }
                type="text"
                inputMode="numeric"
              />
              <TextField
                label="max"
                value={maxValue}
                onChange={(e) =>
                  onClickValue("maxValue", e.target.value, setMaxValue)
                }
                type="text"
                inputMode="numeric"
              />
            </Flex>{" "}
            <Flex direction="row" gap="1rem" alignItems="center">
              <Text fontWeight="bold" fontSize="5vh">
                選曲
              </Text>
              <Text
                width="200px"
                fontSize="20vh"
                textAlign="center"
                fontWeight="bold"
              >
                {selectedNumber}
              </Text>
            </Flex>
            <TextField
              label="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              inputMode="text"
            />
            <Flex direction="row" gap="1rem" alignItems="center">
              <Button onClick={onClickGet} variation="primary">
                ゲッツ！
              </Button>
              <Button onClick={onClickRegister} variation="primary">
                登録
              </Button>
            </Flex>
            <Button onClick={onClickSkip}>スキップ</Button>
            <Button onClick={signOut} variation="link">
              サインアウト
            </Button>
          </Flex>
        </main>
      )}
    </Authenticator>
  );
}
