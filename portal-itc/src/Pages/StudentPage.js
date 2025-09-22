import { useState, useContext } from 'react';
import {
  FaBars, FaTimes, FaUser, FaUserCircle, FaSignOutAlt,
  FaTh, FaUsers, FaCar, FaFileAlt, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import MyWallet from '../Pages/StudentPage/MyWallet';
import MyProfile from '../Pages/StudentPage/MyProfile';
import Settings from '../Pages/StudentPage/Settings';
import ResultChecker from '../Pages/StudentPage/ResultChecker';
import StudentPayments from './StudentPage/ManageBursery';
import Timetable from './StudentPage/MyTimeTable';
import ExamTimetable from './StudentPage/My ExamTimeTable';
import CalendarEvent from './StudentPage/CalendarEvent';
import Library from './StudentPage/library';
import ClassSubjectsView from './StudentPage/Mysubjects';

const sections = {
  'Overview': { component: CalendarEvent, icon: FaTh },
  'My Profile': { component: MyProfile, icon: FaUser },
  'My Subjects': { component: ClassSubjectsView, icon: FaUsers },
  'Result Checker': { component: ResultChecker, icon: FaFileAlt },
  'Bursery': { component: StudentPayments, icon: FaUsers },
  'My Wallet': { component: MyWallet, icon: FaUsers },
  'E-Materials': { component: Library, icon: FaUser },
  'Logout': { component: Settings, icon: FaSignOutAlt },
};

const timetableSections = {
  'My Timetable': { component: Timetable, icon: FaFileAlt },
  'My Exam Timetable': { component: ExamTimetable, icon: FaFileAlt },
};

const SAdminDashboard = () => {
  const [currentSection, setCurrentSection] = useState('Overview');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isTimetableOpen, setTimetableOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleTimetableDropdown = () => setTimetableOpen(!isTimetableOpen);

  const CurrentComponent = sections[currentSection]?.component || timetableSections[currentSection]?.component;

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 transition duration-300">
        {/* Sidebar */}
        <aside className={`bg-white dark:bg-gray-800 text-gray-800 dark:text-white w-64 fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-50`}>
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold text-itccolor dark:text-white">Student Dashboard</h2>
            <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
              <FaTimes size={22} />
            </button>
          </div>
          <div className="flex flex-col items-center py-4">
            <FaUserCircle size={60} className="text-itccolor dark:text-white mb-2" />
            <p className="text-md font-semibold">{user?.username}</p>
            <span className="text-xs text-gray-500 dark:text-gray-300 bg-itccolor text-white px-2 py-1 rounded-full mt-1">Student</span>
          </div>
          <nav className="mt-4 space-y-1 px-4">
            {Object.keys(sections).map((section) => {
              if (section === 'Logout') return null; // Optional: Move logout to bottom
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

            {/* Dropdown for Timetable */}
            <div className="mb-2">
              <button
                onClick={toggleTimetableDropdown}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-itccolor hover:text-white transition-all duration-200 ${currentSection === 'My Timetable' || currentSection === 'My Exam Timetable' ? 'bg-itccolor text-white' : 'dark:text-white text-gray-700'}`}
              >
                <div className="flex items-center space-x-3">
                  <FaFileAlt />
                  <span className="text-sm font-medium">My Time Table</span>
                </div>
                {isTimetableOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
              </button>

              {isTimetableOpen && (
                <div className="ml-6 mt-1 space-y-1">
                  {Object.keys(timetableSections).map((section) => {
                    const Icon = timetableSections[section].icon;
                    return (
                      <button
                        key={section}
                        onClick={() => {
                          setCurrentSection(section);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-itccolor hover:text-white transition-all duration-200 ${currentSection === section ? 'bg-itccolor text-white' : 'dark:text-white text-gray-700'}`}
                      >
                        <Icon />
                        <span className="text-sm font-medium">{section}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Logout Button (Moved to bottom) */}
            <button
              onClick={() => {
                setCurrentSection('Logout');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-itccolor hover:text-white transition-all duration-200 ${currentSection === 'Logout' ? 'bg-itccolor text-white' : 'dark:text-white text-gray-700'}`}
            >
              <FaSignOutAlt />
              <span className="text-sm font-medium">Logout</span>
            </button>
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
