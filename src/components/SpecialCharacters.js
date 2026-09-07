// src/components/SpecialCharacters.js
import React from "react";
import { Button, Box } from "@chakra-ui/react";

const SpecialCharacters = ({ onCharacterClick }) => {
  const specialChars = [
    "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩",
    "Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ", "Ⅹ",
    "ⅰ", "ⅱ", "ⅲ", "ⅳ", "ⅴ", "ⅵ", "ⅶ", "ⅷ", "ⅸ", "ⅹ",
    "「", "」", "『", "』", "§", "甲", "乙", "丙", "丁", "戊", "己",
  ];

  const handleMouseDown = (e) => {
    // 💡 핵심 1: 버튼을 누를 때 에디터에서 포커스가 빠져나가는 것을 원천 차단 (e.preventDefault)
    e.preventDefault();
  };

  const handleClick = (char) => {
    // 💡 핵심 2: React의 렌더링을 기다리지 않고 브라우저 네이티브 명령어로 기호를 즉시 삽입
    document.execCommand("insertText", false, char);
    
    // (선택) 부모 컴포넌트의 상태도 업데이트 해줍니다.
    if (onCharacterClick) {
      onCharacterClick(char);
    }
  };

  return (
    <Box>
      {specialChars.map((char) => (
        <Button
          padding="0px"
          border="0"
          key={char}
          onMouseDown={handleMouseDown} // 마우스 누를 때 포커스 이탈 방지
          onClick={() => handleClick(char)} // 클릭 시 즉시 텍스트 삽입
          variant="outline"
        >
          {char}
        </Button>
      ))}
    </Box>
  );
};

export default SpecialCharacters;