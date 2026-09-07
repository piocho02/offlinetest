import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Answer from './pages/Answer'; // 경로에 맞게 수정

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          {/* 기본 경로 접속 시 바로 답안 작성기로 이동 */}
          <Route path="/" element={<Answer />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;