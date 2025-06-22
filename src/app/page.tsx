"use client";

import {
  Authenticator,
  Button,
  TextField,
  Flex,
  Text,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import outputs from "../../amplify_outputs.json";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  getSettingValueByKey,
  updateSettingByKey,
} from "@/module/dataAccess/settings";

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

  useEffect(() => {
    getSettingValueByKey("minValue").then((value) => {
      setMinValue(parseInt(value || "0"));
    });
    getSettingValueByKey("maxValue").then((value) => {
      setMaxValue(parseInt(value || "300"));
    });
    getSettingValueByKey("selectedNumber").then((value) => {
      setSelectedNumber(parseInt(value));
    });
  }, []);

  const generateRandomNumber = (): number => {
    if (minValue > maxValue) {
      return 0;
    }
    const randomNumber =
      Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    return randomNumber;
  };

  function onClickValue(
    key: string,
    v: string,
    setState: Dispatch<SetStateAction<number>>
  ) {
    const value = parseInt(v);
    setState(value);
    updateSettingByKey(key, v);
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
              <Text fontWeight="bold" width="100px">
                選曲
              </Text>
              <Text
                width="200px"
                fontSize="4xl"
                textAlign="center"
                fontWeight="bold"
              >
                {selectedNumber}
              </Text>
            </Flex>
            <Button onClick={generateRandomNumber} variation="primary">
              ランダム生成
            </Button>
            <Button onClick={signOut}>サインアウト</Button>
          </Flex>
        </main>
      )}
    </Authenticator>
  );
}
