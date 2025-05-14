import { useState, useContext } from 'react';
import {
  FaBars, FaTimes, FaUser, FaUserCircle, FaSignOutAlt,
  FaCalendarAlt, FaUsers, FaChalkboardTeacher, FaFileAlt, FaUserCog
} from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import ManageUsers from '../Pages/PrincipalPages/Overall';
import ManageResults from '../Pages/PrincipalPages/OverAllSubPages/ApproveResult';
import ManagePortal from '../Pages/PrincipalPages/ManageUsers';
import MyProfile from '../Pages/PrincipalPages/MyProfile';
import TeacherReg from '../Pages/PrincipalPages/teacherRegistration';
import Settings from '../Pages/PrincipalPages/Settings';
import StudentsReg from '../Pages/PrincipalPages/studentRegistation';
import Account from '../Pages/PrincipalPages/ManagePayment';
import PaymentVerification  from '../Pages/PrincipalPages/VerifyPaymentStatus';
const sections = {
  'Academic Setup': { component: ManageUsers, icon: FaCalendarAlt },
  'Students Manager': { component: StudentsReg, icon: FaUsers },
  'Teachers Manager': { component: TeacherReg, icon: FaChalkboardTeacher },
  'Manage Results': { component: ManageResults, icon: FaFileAlt },
  'Manage Accounts': { component: Account, icon: FaFileAlt },
  'Payment Verification': { component: PaymentVerification, icon: FaFileAlt },
  'Portal Users': { component: ManagePortal, icon: FaUserCog },
  'My Profile': { component: MyProfile, icon: FaUser },
  'Logout': { component: Settings, icon: FaSignOutAlt },
};

const SAdminDashboard = () => {
  const [currentSection, setCurrentSection] = useState('Academic Setup');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user } = useContext(AuthContext);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const CurrentComponent = sections[currentSection].component;

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 transition duration-300">
        {/* Sidebar */}
        <aside className={`bg-white dark:bg-gray-800 text-gray-800 dark:text-white w-64 fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-50`}>
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold text-itccolor dark:text-white">Principal Dashboard</h2>
            <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
              <FaTimes size={22} />
            </button>
          </div>
          <div className="flex flex-col items-center py-4">
            <FaUserCircle size={60} className="text-itccolor dark:text-white mb-2" />
            <p className="text-md font-semibold">{user?.username}</p>
            <span className="text-xs text-gray-500 dark:text-gray-300 bg-itccolor text-white px-2 py-1 rounded-full mt-1">Principal</span>
          </div>
          <nav className="mt-4 space-y-1 px-4">
            {Object.keys(sections).map((section) => {
              const Icon = sections[section].icon;
              return (
                <button
                  key={section}
                  onClick={() => {
                    setCurrentSection(section);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-itccolor hover:text-white transition-all duration-200 ${currentSection === section ? 'bg-itccolor text-white' : 'dark:text-white text-gray-700'}`}
                >
                  <Icon />
                  <span className="text-sm font-medium">{section}</span>
                </button>
              );
            })}
          </nav>

          {/* Dark Mode Toggle */}
          <div className="mt-auto p-4">
            <button
              onClick={toggleDarkMode}
              className="w-full text-sm py-2 px-4 rounded-md bg-gray-200 dark:bg-gray-600 dark:text-white hover:bg-itccolor hover:text-white transition"
            >
              {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
          </div>
        </aside>

        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between bg-itccolor text-white p-4">
          <button onClick={() => setSidebarOpen(true)}><FaBars size={24} /></button>
          <h2 className="text-lg font-semibold">MGHSO Portal</h2>
          <FaUser size={24} />
        </div>

        {/* Main Content */}
        <main className="flex-1 ml-0 md:ml-64 p-4 md:p-6 transition duration-300">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-300">
            <CurrentComponent />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SAdminDashboard;