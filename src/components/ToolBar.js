// src/components/ToolBar.js
import React, { useState } from "react";
import { Flex, Button, IconButton } from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons"; 
import {
  FaCut,
  FaUndo,
  FaAlignRight,
  FaAlignLeft,
  FaAlignCenter,
  FaBold 
} from "react-icons/fa"; 
import {
  FaMagnifyingGlassMinus,
  FaMagnifyingGlassPlus,
  FaRegPaste,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa6";

const ToolBar = ({
  toggleSpecialChar,
  onZoomIn,
  onZoomOut,
  isPreviewMode,
}) => {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      document.execCommand("insertText", false, text); 
      console.log("Text pasted from clipboard");
    } catch (err) {
      console.error("Failed to paste text: ", err);
    }
  };

  const [isOpen, setIsOpen] = useState(true); 

  return (
    <Flex
      alignItems="center"
      justifyContents="center"
      direction="column"
      position="fixed"
      left="20px"
      top="80px"
      zIndex="1000"
      width="50px" 
    >
      <IconButton
        aria-label={isOpen ? "접기" : "펼치기"}
        icon={isOpen ? <FaChevronUp /> : <FaChevronDown />}
        onClick={() => setIsOpen(!isOpen)} 
        variant="ghost"
        size="sm"
        mb="2"
      />
      {isOpen && (
        <Flex
          direction="column"
          borderRadius="12px"
          bg="white"
          p="2"
          border="1px solid"
          borderColor="gray.300"
          boxShadow="sm"
        >
          {!isPreviewMode && (
            <>
              {/* 실행 취소 */}
              <IconButton
                mb="2"
                aria-label="실행 취소"
                icon={<FaUndo />}
                onClick={() => document.execCommand("undo")}
                variant="ghost"
                size="sm" 
              />

              {/* 실행 취소의 취소 */}
              <IconButton
                mb="2"
                aria-label="실행 취소의 취소"
                icon={<FaUndo />}
                onClick={() => document.execCommand("redo")}
                sx={{ transform: "scaleX(-1)" }}
                variant="ghost" 
                size="sm" 
              />

              {/* 굵게 (수정된 부분: variant를 ghost로 변경) */}
              <IconButton
                mb="2"
                aria-label="굵게"
                icon={<FaBold />}
                onClick={() => document.execCommand("bold")}
                variant="ghost" 
                size="sm" 
              />

              {/* 정렬 그룹 */}
              <IconButton
                mb="2"
                aria-label="왼쪽 정렬"
                icon={<FaAlignLeft />}
                onClick={() => document.execCommand("justifyLeft")}
                variant="ghost" 
                size="sm" 
              />
              <IconButton
                mb="2"
                aria-label="중앙 정렬"
                icon={<FaAlignCenter />}
                onClick={() => document.execCommand("justifyCenter")}
                variant="ghost" 
                size="sm" 
              />
              <IconButton
                mb="2"
                aria-label="오른쪽 정렬"
                icon={<FaAlignRight />}
                onClick={() => document.execCommand("justifyRight")}
                variant="ghost" 
                size="sm" 
              />

              {/* 클립보드 그룹 */}
              <IconButton
                mb="2"
                aria-label="복사"
                icon={<CopyIcon />}
                onClick={() => document.execCommand("copy")}
                variant="ghost" 
                size="sm" 
              />
              <IconButton
                mb="2"
                aria-label="오리기"
                icon={<FaCut />}
                onClick={() => document.execCommand("cut")}
                variant="ghost" 
                size="sm" 
              />
              <IconButton
                mb="2"
                aria-label="붙여넣기"
                icon={<FaRegPaste />}
                onClick={handlePaste}
                variant="ghost" 
                size="sm" 
              />
              
              {/* 기호 버튼 */}
              <Button
                mb="2"
                onClick={toggleSpecialChar}
                variant="ghost" 
                size="sm"
                fontSize="12px"
              >
                기호
              </Button>
            </>
          )}

          {/* 돋보기 (확대/축소) */}
          <IconButton
            mb="2"
            aria-label="확대"
            icon={<FaMagnifyingGlassPlus />}
            onClick={onZoomIn} 
            variant="ghost"
            size="sm"
          />
          <IconButton
            mb="1"
            aria-label="축소"
            icon={<FaMagnifyingGlassMinus />}
            onClick={onZoomOut} 
            variant="ghost"
            size="sm"
          />
        </Flex>
      )}
    </Flex>
  );
};

export default ToolBar;