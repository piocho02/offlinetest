// src/components/Editor.js
import React, { useState, useEffect } from "react";

// 💡 [수정됨] 선 누락 및 배경색 번짐 방지를 위한 도장(Tiling) 패턴 적용
const bjhStyle = `linear-gradient(
  transparent, transparent 39px, rgb(238, 238, 238) 39px, rgb(238, 238, 238) 40px
), linear-gradient(
   to bottom,
   rgba(255, 255, 255, 1) 0%,
   rgba(255, 255, 255, 1) 50%,
   rgba(243, 247, 255, 1) 50%,
   rgba(243, 247, 255, 1) 100%
)`;

const Editor = React.forwardRef(
  (
    {
      scale,
      isPreviewMode,
      isTransitioning,
      editorRef,
      fetchedContent,
    },
    ref
  ) => {
    const [lineNumbers, setLineNumbers] = useState([]);

    const lineHeight = 40; 

    const calculateVisibleLines = () => {
      if (editorRef.current) {
        const editorHeight = editorRef.current.scrollHeight; 
        const totalLines = Math.floor(editorHeight / lineHeight); 
        const newLineNumbers = [];
        let currentPage = 1;
        let currentPageLine = 0;
        
        // 💡 [수정됨] 1페이지만 상단 헤더 공간(160px) 제외하여 30줄 배정
        let currentPageMaxLines = 30; 

        for (let i = 0; i < totalLines; i++) {
          if (currentPageLine >= currentPageMaxLines) {
            currentPage++;
            currentPageLine = 0;
            // 💡 [수정됨] 2페이지부터는 34줄로 고정
            currentPageMaxLines = 34; 
          }
          currentPageLine++;
          newLineNumbers.push({
            page: currentPage,
            line: currentPageLine,
          });
        }
        setLineNumbers(newLineNumbers);
      }
    };

    useEffect(() => {
      calculateVisibleLines();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (fetchedContent && editorRef.current) {
        editorRef.current.innerText = fetchedContent;
      }
    }, [fetchedContent, editorRef]);

    const keepCursorCentered = () => {
      if (isPreviewMode) return;

      const getScrollParent = (node) => {
        if (node == null) return null;
        if (node === document.body || node === document.documentElement) return window;
        const style = window.getComputedStyle(node);
        if (node.scrollHeight > node.clientHeight && (style.overflowY === 'auto' || style.overflowY === 'scroll')) {
          return node;
        }
        return getScrollParent(node.parentNode);
      };

      setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        let rect = range.getBoundingClientRect();

        // 💡 [버그 해결 핵심] 브라우저가 길을 잃고 에디터 전체(5280px)를 잡아버리는 현상 완벽 차단
        if (!rect || rect.height === 0 || rect.height > 100) {
          let element = range.startContainer.nodeType === 1 
            ? range.startContainer 
            : range.startContainer.parentElement;
            
          // 에디터 자체가 잡혔을 경우, 자식 노드로 범위를 좁힘
          if (element && element.classList && element.classList.contains('editor')) {
             let childNode = element.childNodes[range.startOffset];
             if (!childNode) childNode = element.lastChild;
             
             if (childNode) {
                 if (childNode.nodeType === 3) { 
                     // 숨어있는 텍스트 노드(특수문자 등)일 경우 Range를 만들어 정확한 글자 크기 추출
                     const tempRange = document.createRange();
                     tempRange.selectNodeContents(childNode);
                     rect = tempRange.getBoundingClientRect();
                 } else if (childNode.getBoundingClientRect) {
                     rect = childNode.getBoundingClientRect();
                 }
             }
          }
        }

        // 2차 철통 방어: 복구 시도 후에도 여전히 비정상적으로 크다면 튀어오르지 않게 스크롤을 조용히 멈춤
        if (!rect || rect.height === 0 || rect.height > 100) {
          return; 
        }

        const scrollParent = getScrollParent(editorRef.current);
        if (!scrollParent) return;

        const isWindow = scrollParent === window;
        const parentTop = isWindow ? 0 : scrollParent.getBoundingClientRect().top;
        const parentHeight = isWindow ? window.innerHeight : scrollParent.clientHeight;
        const parentCenter = parentTop + (parentHeight / 2);

        const safeCursorHeight = Math.min(rect.height || 40, 40);
        const cursorY = rect.top + (safeCursorHeight / 2);
        
        const offset = cursorY - parentCenter;

        if (Math.abs(offset) <= 150) return;

        const currentScrollTop = isWindow ? window.scrollY : scrollParent.scrollTop;
        const targetScrollTop = currentScrollTop + offset;

        const maxScroll = isWindow 
          ? document.documentElement.scrollHeight - window.innerHeight
          : scrollParent.scrollHeight - scrollParent.clientHeight;

        const safeTargetScrollTop = Math.max(0, Math.min(targetScrollTop, maxScroll));
        const finalOffset = safeTargetScrollTop - currentScrollTop;

        if (Math.abs(finalOffset) > 1) { 
          if (isWindow) {
            window.scrollBy({ top: finalOffset, behavior: 'smooth' });
          } else {
            scrollParent.scrollBy({ top: finalOffset, behavior: 'smooth' });
          }
        }
      }, 0);
    };

    useEffect(() => {
      const editor = editorRef.current;
      if (!editor) return;

      const handleInput = () => {
        calculateVisibleLines();
        keepCursorCentered();
      };

      editor.addEventListener("input", handleInput);
      editor.addEventListener("keyup", keepCursorCentered);
      editor.addEventListener("click", keepCursorCentered);

      return () => {
        editor.removeEventListener("input", handleInput);
        editor.removeEventListener("keyup", keepCursorCentered);
        editor.removeEventListener("click", keepCursorCentered);
      };
    }, [isPreviewMode]); 

    return (
      <div>
        <div
          style={{
            display: "flex",
            borderRadius: "15px",
            transform: `scale(${scale})`,
            transformOrigin: "center 0",
            transition: "transform 0.2s ease",
          }}
        >
          <div style={{ width: "40px" }}>
            <div style={{ height: "80px" }} />
            <div style={{ height: "80px", width: "12px" }} />
            {lineNumbers.map((line, index) => (
              <p
                key={index}
                style={{
                  color: index % 2 === 0 ? "gray" : "transparent",
                  lineHeight: "40px",
                  fontSize: "11px",
                  margin: 0,
                }}
              >
                {line.line} {line.line === 1 && `(${line.page}쪽)`}
              </p>
            ))}
          </div>

          <div ref={ref}>
            <div style={{ height: "80px" }} />

            <div
              style={{
                height: "40px",
                backgroundColor: "#003664",
                borderRadius: "10px 10px 0px 0px",
                textAlign: "center",
              }}
            >
              <span style={{ color: "white", fontWeight: "700", fontSize: "24px", lineHeight: "40px", display: "inline-block" }}>
                문형
              </span>
            </div>

            <div
              style={{
                height: "40px",
                backgroundColor: "#E3EFFF",
                textAlign: "center",
              }}
            >
              <span style={{ color: "#003664", fontWeight: "700", fontSize: "24px", lineHeight: "40px", display: "inline-block" }}>
                사례형
              </span>
            </div>

            <div
              className="page-wrapper"
              style={{
                width: "938px",
                padding: "0 18px",
                minHeight: "5280px",
                margin: "0 auto",
                fontFamily: "Noto Sans KR",
                borderColor: "gray",
                backgroundImage: bjhStyle,
                // 💡 [수정됨] 도장 찍기용 세부 설정 추가
                backgroundSize: "100% 40px, 100% 2720px", 
                backgroundRepeat: "repeat-y, repeat-y", 
                backgroundPosition: "0 0, 0 -160px",
              }}
            >
              <div
                contentEditable={!isPreviewMode}
                suppressContentEditableWarning={true}
                spellCheck="false"
                ref={editorRef}
                className="page editor"
                style={{
                  minHeight: "5280px",
                  fontSize: "20px",
                  lineHeight: `${lineHeight}px`,
                  whiteSpace: "pre-wrap",
                  outline: "none",
                  transition: "opacity 0.3s ease, transform 0.2s ease",
                  opacity: isTransitioning ? 0 : 1,
                  WebkitFontSmoothing: "antialiased",
                }}
              >
                <div>
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ height: "100px" }} />

        <style>
          {`
          @media print {
            * {
              -webkit-print-color-adjust: exact !important; 
              color-adjust: exact !important; 
              print-color-adjust: exact !important;
            }

            /* 💡 [수정됨] 배경이 투명하게 날아가는 문제(background-image: none !important;) 삭제 */

            .printable-content {
              height: 1360px !important;
              page-break-after: always;
            }
            .printable-content:first-child {
              padding-top: 80px; 
            }
            @page {
              size: A4;
              margin: 8.78mm;
            }
          }
        `}
        </style>
      </div>
    );
  }
);

export default Editor;