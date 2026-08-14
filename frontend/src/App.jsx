import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<div className="p-5 text-center"><h2>Dashboard</h2><p>Authentication successful! Dashboard coming soon.</p></div>} />
        <Route path="*" element={<Navigate to="/register" />} />
      </Routes>
    </Router>
  )
}

export default App
