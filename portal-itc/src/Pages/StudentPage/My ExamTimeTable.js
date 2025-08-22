import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getStudentById } from '../../services/studentService';
import { getClassById } from '../../services/ClassService';
import { getAllSessions } from '../../services/SessionService';

const StudentExamTimetable = () => {
  const { user } = useContext(AuthContext);
  const [timetable, setTimetable] = useState({ schedule: [] }); // Initialize with empty schedule
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('list');
  const [academicYears, setAcademicYears] = useState([]);
  const [className, setStudentClass] = useState('');
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchAcademicYears();
        await fetchStudentProfile();
      } catch (err) {
        setError('Failed to load initial data');
      }
    };
    loadData();
  }, []);

  useEffect(() => {

    console.log('Selected year:', selectedYear);
    console.log('Class name:', className);
    if ((selectedYear || academicYears.length > 0) && className) {
      console.log('Fetching timetable...');
      fetchTimetable();
    }

    // if ((selectedYear || academicYears.length > 0) && className) {
    //   fetchTimetable();
    // }
  }, [selectedYear, className]);

  const fetchAcademicYears = async () => {
    try {
      const res = await getAllSessions();
      const availableYears = Array.isArray(res) ? res : [];
      setAcademicYears(availableYears);
  
      // Set selectedYear only if it exists in availableYears
      const currentYear = `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`;
      
      // Find if current year exists in available years
      const yearExists = availableYears.some(year => year.name === currentYear);
      
      // Set to first available year if current year doesn't exist
      setSelectedYear(
        yearExists ? currentYear : 
        availableYears.length > 0 ? availableYears[0].name : 
        ''
      );
  
    } catch (err) {
      toast.error('Failed to fetch academic years');
      setAcademicYears([]);
      setSelectedYear('');
    }
  };

  // const fetchStudentProfile = async () => {
  //   try {
  //     const res = await getStudentById(user?._id);
  //     if (res?.data?.class) {
  //       const classRes = await getClassById(res.data.class);
  //       setStudentClass(classRes?.data?.name || '');
  //     }
  //   } catch (err) {
  //     setError(err.response?.data?.message || 'Failed to fetch student profile');
  //   }
  // };

  const fetchStudentProfile = async () => {
    try {
      console.log('Fetching student with ID:', user?._id);
      const res = await getStudentById(user?._id);
      console.log('Student response:', res.data?.data?.class);
      
      if (res?.data?.data?.class) {
        const classRes = await getClassById(res.data?.data?.class);
        console.log('Class response:', classRes);
        setStudentClass(classRes?.data?.name || '');
      } else {
        console.log('No class found in student data');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to fetch student profile');
    }
  };

  const fetchTimetable = async () => {

    if (!className || !selectedYear) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(`/academic/api/examtimetable/class/${className}`, {
        params: { academicYear: selectedYear }
      });
      setTimetable(res.data || { schedule: [] });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch timetable');
      setTimetable({ schedule: [] });
    } finally {
      setLoading(false);
    }
  };


  const filteredExams = (timetable?.schedule || []).filter(item => {
    try {
      const examDate = new Date(item?.date);
      return examDate.toDateString() === selectedDate.toDateString();
    } catch {
      return false;
    }
  });

  // Safe date formatting function
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };



  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Exam Timetable</h1>
      
      {/* Year Selection Dropdown */}
      <div className="mb-6 bg-blue-300 p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="w-full md:w-auto">
            <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 mb-1">
              Academic Year
            </label>
            <select
              id="academicYear"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {Array.isArray(academicYears) && academicYears.map((year) => (
                <option key={year?._id || year?.name} value={year?.name}>
                  {year?.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-md ${activeTab === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab('list')}
            >
              List View
            </button>
            <button
              className={`px-4 py-2 rounded-md ${activeTab === 'calendar' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab('calendar')}
            >
              Calendar View
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (timetable?.schedule?.length || 0) > 0 ? (
        <>
          <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
            <h2 className="text-xl font-semibold">{timetable?.examName || 'Exam Timetable'}</h2>
            <p>Class: {className || 'N/A'} | Academic Year: {timetable?.academicYear || 'N/A'}</p>
          </div>

          {activeTab === 'list' ? (
            <div className="bg-white rounded-b-lg shadow-md overflow-hidden">
              <div className="divide-y divide-gray-200">
                {timetable.schedule.map((item, index) => (
                  <div key={index} className="px-4 py-3 hover:bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      <div className="font-medium">
                        {formatDate(item?.date)}
                      </div>
                      <div className="font-semibold">
                        {item?.subjectName || 'N/A'}
                      </div>
                      <div className="text-blue-600">
                        {item?.startTime || '--'} - {item?.endTime || '--'}
                      </div>
                      <div className="text-sm">
                        Room: {item?.room || 'N/A'}
                      </div>
                      <div className="text-sm">
                        {item?.supervisorName ? `Supervisor: ${item.supervisorName}` : ''}
                      </div>
                    </div>
                    {item?.notes && (
                      <div className="mt-1 text-xs text-gray-500">
                        Notes: {item.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-b-lg shadow-md p-4 md:p-6">
              <div className="mb-4">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  inline
                  className="border rounded-lg p-2 w-full"
                  highlightDates={timetable.schedule
                    .map(item => item?.date)
                    .filter(Boolean)
                    .map(date => new Date(date))}
                />
              </div>
              
              <h3 className="text-lg font-medium mb-3">
                Exams on {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              
              {filteredExams.length > 0 ? (
                <div className="space-y-3">
                  {filteredExams.map((exam, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-3 py-2 bg-gray-50 rounded">
                      <div className="font-semibold">{exam?.subjectName || 'N/A'}</div>
                      <div className="text-sm text-gray-600">
                        {exam?.startTime || '--'} - {exam?.endTime || '--'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {exam?.room && <span>Room: {exam.room} • </span>}
                        {exam?.supervisorName && <span>Supervisor: {exam.supervisorName}</span>}
                      </div>
                      {exam?.notes && (
                        <div className="text-xs mt-1 text-gray-600 italic">
                          {exam.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No exams scheduled for this day
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
          No published exam timetable available for {className || 'your class'} in {selectedYear || 'selected year'}
        </div>
      )}
    </div>
  );
};

export default StudentExamTimetable;