import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PostsList from './components/PostsList';
import PostDetails from './components/PostDetails';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PostsList />} />
        <Route path="/post/:postId" element={<PostDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
