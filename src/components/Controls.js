import React, { useRef } from "react";
import { Button, Input, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print"; // 💡 패키지 다시 불러오기

const Controls = ({
  togglePreviewMode,
  isPreviewMode,
  textRef,
  editorRef,
  subject,
  setSubject,
}) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // 1. 텍스트 파일로 저장하기 ('다른 이름으로 저장' 창 띄우기)
  const handleSaveToFile = async () => {
    const content = textRef.current.innerText;
    if (!content.trim()) {
      alert("저장할 내용이 없습니다.");
      return;
    }

    const defaultFileName = `${subject || "사례형연습"}.txt`;

    try {
      if (window.showSaveFilePicker) {
        // OS 기본 '다른 이름으로 저장' 창 호출
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: defaultFileName,
          types: [{ description: "Text Files", accept: { "text/plain": [".txt"] } }],
        });
        
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();
        
        // 수정한 파일명으로 상단 제목 즉시 동기화
        if (setSubject) {
          setSubject(fileHandle.name.replace(/\.[^/.]+$/, ""));
        }
      } else {
        // API 미지원 브라우저 대비 기존 폴백
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = defaultFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("파일 저장 중 오류 발생:", error);
        alert("파일 저장에 실패했습니다.");
      }
    }
  };

  // 2. 텍스트 파일 불러오기
  const handleLoadClick = () => {
    fileInputRef.current.click();
  };

  // 3. 파일 선택 시 에디터에 내용 삽입
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    if (setSubject) {
      setSubject(fileNameWithoutExt);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (textRef.current) {
        textRef.current.innerText = e.target.result;
      }
    };
    reader.readAsText(file);
    event.target.value = null; 
  };

  const handleMainPageRedirect = () => {
    navigate("/");
  };

  // 💡 4. react-to-print를 사용한 완벽한 인쇄 로직
  const handlePrint = useReactToPrint({
	contentRef: editorRef, // 🟢 최신 버전에 맞게 수정 (이름 변경 및 함수 형태 제거)
    documentTitle: subject || "사례형 답안 연습", // PDF 저장 시 기본 파일명
  });

  return (
    <Flex gap="3" alignItems="center">
      <Button
        onClick={togglePreviewMode}
        colorScheme="blue"
        bg="#003664"
        height="40px"
      >
        {isPreviewMode ? "편집 모드로 돌아가기" : "답안 미리보기"}
      </Button>

      <Input
        type="file"
        accept=".txt"
        ref={fileInputRef}
        onChange={handleFileChange}
        display="none"
      />

      <Button colorScheme="teal" bg="#4A7c59" onClick={handleLoadClick}>
        파일 불러오기 (.txt)
      </Button>

      <Button colorScheme="blue" bg="#003664" onClick={handleSaveToFile}>
        파일로 저장 (.txt)
      </Button>

      {/* 💡 프린트 버튼 연결 */}
      <Button colorScheme="gray" onClick={handlePrint}>
        프린트
      </Button>
      
      <Button colorScheme="red" variant="outline" onClick={handleMainPageRedirect}>
        나가기
      </Button>
    </Flex>
  );
};

export default Controls;