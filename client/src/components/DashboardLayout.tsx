import { Outlet } from 'react-router-dom';
import Header from './HeaderAdmin';
import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';


const DashboardLayout = () => {


  const user = useSelector((state: RootState) => state.user);
  if (!user?.isAdmin) {
    return <>
        <div className='w-full flex justify-center text-center items-center '>

          <p className='text-2xl text-red-600'>pas autorisé</p>
        </div>
    </>
  }
  return (
    <div className="flex  min-h-screen bg-gray-100 ">


      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1  w-75 p-6 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;