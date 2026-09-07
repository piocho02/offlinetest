import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import Editor from "../components/Editor";
import Timer from "../components/Timer";
import SpecialCharacters from "../components/SpecialCharacters";
import Controls from "../components/Controls";
import ToolBar from "../components/ToolBar";

const Answer = () => {
  const location = useLocation();
  const { examSubject = "사례형 답안 연습", timeLimitOption = "none", timeLimit = "00:00" } = location.state || {};
const [subject, setSubject] = useState(examSubject);

  const [selectedChar, setSelectedChar] = useState("");
  const [isSpecialCharOpen, setIsSpecialCharOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const editorRef = useRef();
  const textRef = useRef(null);
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));
  const toggleSpecialChar = () => setIsSpecialCharOpen(!isSpecialCharOpen);
  const handleSpecialCharClick = (char) => setSelectedChar(char);

  const togglePreviewMode = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsPreviewMode((prevMode) => !prevMode);
      setIsTransitioning(false);
    }, 300);
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "변경사항이 저장되지 않을 수 있습니다. 정말로 나가시겠습니까?";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return (
	<Flex className="print-root" direction="column" height="100vh">
      {/* 🛑 상단 바 (출력 시 숨김) */}
      <Flex
        className="no-print"
        width="full"
        position="fixed"
        top="0"
        zIndex="1000"
        padding="20px"
        justify="space-between"
        align="center"
        backgroundColor="#003664"
        height="60px"
      >
        <Flex gap="10px" alignItems="center">
          <Text color="gold">작성자</Text>
          <Text color="white" fontSize="24px">오프라인 모드</Text>
        </Flex>
        <Text fontSize="20px" color="white">
          {subject}
        </Text>
        <Timer timeLimitOption={timeLimitOption} timeLimit={timeLimit} />
      </Flex>

      {/* 🟢 본문 영역 (출력 시 전체 높이로 스크롤 확장) */}
      <Flex
        className="print-container"
        mb="60px"
        justify="center"
        backgroundColor="gray.100"
        overflow="auto"
        height="calc(100vh - 60px)"
      >
        {/* 🛑 좌측 툴바 (출력 시 숨김) */}
        <Box className="no-print">
          <ToolBar
            toggleSpecialChar={toggleSpecialChar}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            isPreviewMode={isPreviewMode}
            isTransitioning={isTransitioning}
          />
        </Box>

        {/* 🛑 특수문자 팝업 창 (출력 시 숨김) */}
        {isSpecialCharOpen && (
          <Box
            className="no-print"
            width="200px"
            position="fixed"
            left="100px"
            top="170px"
            bg="white"
            p="4"
            border="1px solid gray"
            boxShadow="md"
            zIndex="1001"
          >
            <Button
              aria-label="Close"
              onClick={() => setIsSpecialCharOpen(false)}
              position="absolute"
              top="4px"
              right="4px"
              size="xs"
              variant="ghost"
            >
              ❌
            </Button>
            <Box height="20px" />
            <SpecialCharacters onCharacterClick={handleSpecialCharClick} />
          </Box>
        )}

        <Editor
          ref={editorRef}
          specialChar={selectedChar}
          scale={scale}
          isPreviewMode={isPreviewMode}
          isTransitioning={isTransitioning}
          editorRef={textRef}
          fetchedContent={""}
        />
      </Flex>

      {/* 🛑 하단 컨트롤 버튼 바 (출력 시 숨김) */}
      <Flex
        className="no-print"
        justify="flex-end"
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        bg="#A2C2C0"
        p="1.5"
        borderTop="1px solid gray"
      >
	<Controls
        togglePreviewMode={togglePreviewMode}
        isPreviewMode={isPreviewMode}
        textRef={textRef}
        editorRef={editorRef}
        subject={subject}
        setSubject={setSubject}
      />
      </Flex>
    </Flex>
  );
};

export default Answer;