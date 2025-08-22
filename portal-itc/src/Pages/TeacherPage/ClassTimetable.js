import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllTerms } from "../../services/termService";

const TeacherTimetablePage = () => {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [availableClasses, setAvailableClasses] = useState([]);
  // const [availableYears, setAvailableYears] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
const [availableTerms, setAvailableTerms] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('/academic/api/timetable/admin/timetables');
        const uniqueClasses = [...new Set(response.data.map(item => item.class))];
        setAvailableClasses(uniqueClasses.sort());
        if (uniqueClasses.length > 0) {
          setSelectedClass(uniqueClasses[0]);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
    
  }, []);





  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const terms = await getAllTerms();
        setAvailableTerms(terms);
        if (terms.length > 0) {
          setSelectedTerm(terms[0]._id);
        }
      } catch (error) {
        console.error('Error fetching terms:', error);
      }
    };
    fetchTerms();
  }, []);
  

  // Fetch timetables when class or year changes
  useEffect(() => {
    if (selectedClass && selectedTerm) {
      fetchTimetables();
    }
  }, [selectedClass, selectedTerm]);

  const fetchTimetables = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/academic/api/timetable/teacher/timetables-class-term', {
        params: {
          class: selectedClass,
          term: selectedTerm
        }
      });
      setTimetables(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch timetables');
      console.error('Error fetching timetables:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group timetables by day
  const groupedByDay = timetables.reduce((acc, timetable) => {
    if (!acc[timetable.day]) {
      acc[timetable.day] = [];
    }
    acc[timetable.day].push(timetable);
    return acc;
  }, {});

  // Days of the week in order
  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Class Timetable</h1>
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                Class
              </label>
              <select
                id="class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                 <option value="">Select Class</option>
                {availableClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
  <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-1">
    Term
  </label>
  <select
    id="term"
    value={selectedTerm}
    onChange={(e) => setSelectedTerm(e.target.value)}
    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
  <option value="">Select Term</option>
    {availableTerms.map((term) => (
      <option key={term._id} value={term.name}>
        {term.name}
      </option>
    ))}
  </select>
</div>

          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {/* Timetable display */}
        {!loading && timetables.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Desktop view */}
            <div className="hidden md:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Day
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Periods
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {daysOrder.map((day) => (
                    groupedByDay[day] && (
                      <tr key={day}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {day}
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            {groupedByDay[day].flatMap(timetable => 
                              timetable.periods.map((period, index) => (
                                <div 
                                  key={`${timetable._id}-${index}`}
                                  className="flex items-center p-3 bg-indigo-50 rounded-lg"
                                >
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-indigo-800">{period.subject}</p>
                                    <p className="text-xs text-gray-500">
                                      {period.startTime} - {period.endTime}
                                    </p>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile view */}
            <div className="md:hidden space-y-4 p-4">
              {daysOrder.map((day) => (
                groupedByDay[day] && (
                  <div key={day} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2">
                      <h3 className="font-medium text-gray-800">{day}</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {groupedByDay[day].flatMap(timetable => 
                        timetable.periods.map((period, index) => (
                          <div 
                            key={`${timetable._id}-${index}`}
                            className="px-4 py-3"
                          >
                            <p className="font-medium text-indigo-700">{period.subject}</p>
                            <p className="text-sm text-gray-600">
                              {period.startTime} - {period.endTime}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        ) : (
          !loading && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">No timetables found for the selected class and academic year.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default TeacherTimetablePage;