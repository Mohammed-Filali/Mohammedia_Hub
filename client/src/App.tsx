// src/App.tsx
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import ReclamationForm from './pages/ReclamationForm';
import Login from './pages/Login';
import Register from './pages/Register';
import ReclamationList from './pages/ReclamationList ';
import DashboardLayout from './Admin/DashboardLayout';
import UserList from './Admin/UserList';
import Reclamations from './Admin/ReclamationList';
import PollsStats from './Admin/PollsStats';
import AdminDashboard from './Admin/AdminDashboard';
import Polls from './pages/Polls';
import UserDashboard from './User/UserDashboard';

const App = () => {
  return (
    <BrowserRouter future={{
      v7_startTransition: true, 
      v7_relativeSplatPath: true, 
    }}>
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reclamation" element={<ReclamationForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/polls" element={<Polls />} />
        <Route path="/reclamations-list" element={<ReclamationList />} />
        <Route path="/dashboard" element={<DashboardLayout />} >
              <Route path="/dashboard/users" element={<UserList />} />
              <Route path="/dashboard/reclamations" element={<Reclamations />} />
              <Route path="/dashboard/PollsStats" element={<PollsStats />} />
              <Route index element={<AdminDashboard />} />
        </Route>
        <Route path="/user/dashboard" element={<UserDashboard />} />

        


      </Routes>
   
    </BrowserRouter>
  );
};

export default App;
