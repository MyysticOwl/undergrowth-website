import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DocsLayout from './layouts/DocsLayout';
import DocPage from './pages/DocPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/docs" element={<DocsLayout />}>
          <Route index element={<DocPage />} />
          <Route path=":slug" element={<DocPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
