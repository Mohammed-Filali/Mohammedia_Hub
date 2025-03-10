// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import ReclamationForm from './pages/ReclamationForm';
import Login from './pages/Login';
import Register from './pages/Register';
import ReclamationList from './pages/ReclamationList ';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reclamation" element={<ReclamationForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reclamations-list" element={<ReclamationList />} />

      </Routes>
    </Router>
  );
};

export default App;
