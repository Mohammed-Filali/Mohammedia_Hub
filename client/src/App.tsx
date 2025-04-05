// src/App.tsx
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import ReclamationForm from './pages/ReclamationForm';
import Login from './pages/login';
import Register from './pages/register';
import DashboardLayout from './Admin/DashboardLayout';
import UserList from './Admin/UserList';
import Reclamations from './Admin/ReclamationList';
import PollsStats from './Admin/PollsStats';
import AdminDashboard from './Admin/AdminDashboard';
import Polls from './pages/Polls';
import UserDashboard from './User/UserDashboard';
import NewsList from './pages/NewsList';
import AdminNews from './Admin/News';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return <>

    <ToastContainer
     
      />
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
        <Route path="/News-list" element={<NewsList />} />
        <Route path="/dashboard" element={<DashboardLayout />} >
              <Route path="/dashboard/users" element={<UserList />} />
              <Route path="/dashboard/news" element={<AdminNews />} />
              <Route path="/dashboard/reclamations" element={<Reclamations />} />
              <Route path="/dashboard/PollsStats" element={<PollsStats />} />
              <Route index element={<AdminDashboard />} />
        </Route>
        <Route path="/user/dashboard" element={<UserDashboard />} />

        


      </Routes>
   
    </BrowserRouter>
    </>;
};

export default App;
