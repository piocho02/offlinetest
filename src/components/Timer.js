import React, { useState, useEffect } from "react";
import { Text, Flex, Box } from "@chakra-ui/react";

const Timer = ({ timeLimitOption, timeLimit }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCumulative, setIsCumulative] = useState(false);

  useEffect(() => {
    if (timeLimitOption === "set") {
      const [hours, minutes] = timeLimit.split(":").map(Number);
      setTimeLeft(hours * 3600 + minutes * 60);
    } else if (timeLimitOption === "cumulative") {
      setIsCumulative(true);
      setTimeLeft(0);
    }

    if (timeLimitOption === "set" || timeLimitOption === "cumulative") {
      const intervalId = setInterval(() => {
        setTimeLeft((prev) => {
          if (timeLimitOption === "set") return prev > 0 ? prev - 1 : 0;
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [timeLimitOption, timeLimit]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const min = Math.floor((seconds % 3600) / 60);
    const sec = seconds % 60;
    return `${hrs < 10 ? "0" : ""}${hrs}:${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <Flex borderRadius="10px" bgColor="white" padding="2px 20px" alignItems="center" width="220px">
      <Text fontSize="16px" mr="2">🕒</Text>
      <Text>{timeLimitOption === "cumulative" ? " 걸린 시간 " : " 남은 시간 "}</Text>
      <Box width="10px" />
      {timeLimitOption === "none" ? (
        <Text color="gray.500" fontWeight="bold">무제한</Text>
      ) : (
        <Text color={timeLimitOption === "set" ? "red.500" : "green.500"} fontWeight="bold">
          {formatTime(timeLeft)}
        </Text>
      )}
    </Flex>
  );
};

export default Timer;