import { useEffect, useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import axios from 'axios';
import { getStudentById } from '../../services/studentService';
import { getClassById } from '../../services/ClassService';

export default function TimetableStudent() {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('today');
    const [todayTimetable, setTodayTimetable] = useState(null);
    const [weeklyTimetable, setWeeklyTimetable] = useState([]);
    const [studentClass, setStudentClass] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedDay, setSelectedDay] = useState(''); // Add state for selected day

    // Get current day name
    const getCurrentDay = () => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[new Date().getDay()];
        setSelectedDay(dayName); // Set initial selected day
        return dayName;
    };

    // Fetch student profile to get class
    const fetchStudentProfile = async () => {
        try {
            const res = await getStudentById(user._id);
            const response = await getClassById(res.data.class);
            setStudentClass(response.data.name);
            return response.data.name;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch student profile');
            return null;
        }
    };

    // Fetch today's timetable
    const fetchTodayTimetable = async () => {
        try {
            setLoading(true);
            // const clasnmae = studentClass || await fetchStudentProfile();

            // const classValue = clasnmae.class;
            const rese = await getStudentById(user._id);
            const response = await getClassById(rese.data.name);
            const className = response.data.name;
            console.log(className, 'className')
            if (!className) return;

            const res = await axios.get(`/academic/api/timetable/student/timetable/today`, {
                params: { class: className}
            });
            setTodayTimetable(res.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch timetable');
        } finally {
            setLoading(false);
        }
    };

    // Fetch weekly timetable
    const fetchWeeklyTimetable = async () => {
        try {
            setLoading(true);
            const classValue = studentClass || await fetchStudentProfile();
            if (!classValue) return;

            const res = await axios.get(`/academic/api/timetable/student/timetable/weekly`, {
                params: { class: classValue }
            });

            setWeeklyTimetable(res.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch timetable');
        } finally {
            setLoading(false);
        }
    };

    // Handle day selection in weekly view
    const handleDayClick = (day) => {
        setSelectedDay(day);
    };

    // Load data when tab changes
    useEffect(() => {
        if (activeTab === 'today') {
            fetchTodayTimetable();
            setSelectedDay(getCurrentDay()); // Reset to current day when switching to today tab
        } else {
            fetchWeeklyTimetable();
        }
    }, [activeTab, user._id]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">My Timetable</h1>
            <p className="text-gray-600 mb-6">
                {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}
            </p>
            
            {/* Tabs */}
            <div className="flex border-b mb-6">
                <button
                    className={`px-4 py-2 font-medium ${activeTab === 'today' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('today')}
                >
                    Today
                </button>
                <button
                    className={`px-4 py-2 font-medium ${activeTab === 'weekly' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('weekly')}
                >
                    Weekly
                </button>
            </div>

            {/* Error message */}
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                    {error}
                </div>
            )}

            {/* Today's Timetable */}
            {activeTab === 'today' && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : todayTimetable ? (
                        <>
                            <div className="bg-blue-600 text-white px-6 py-4 flex justify-between">
                                <h3 className="font-semibold">{todayTimetable.day}</h3>
                                <span>Class: {todayTimetable.class}</span>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {todayTimetable.periods.length > 0 ? (
                                    todayTimetable.periods.map((period, index) => (
                                        <div key={index} className="px-6 py-4 hover:bg-gray-50">
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                <div className="text-blue-600 font-medium" >
                                                    {period.startTime} - {period.endTime}
                                                </div>
                                                <div className="font-semibold">{period.subject}</div>
                                                <div>{period.teacher}</div>
                                                <div className="text-gray-500">Room {period.room || 'N/A'}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-6 py-8 text-center text-gray-500">
                                        No classes scheduled for today
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="px-6 py-8 text-center text-gray-500">
                            {error ? 'Failed to load timetable' : 'No timetable available for today'}
                        </div>
                    )}
                </div>
            )}

            {/* Weekly Timetable */}
            {activeTab === 'weekly' && (
                <div>
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : weeklyTimetable.length > 0 ? (
                        <div className="space-y-6">
                            {/* Day tabs */}
                            <div className="flex overflow-x-auto pb-2">
                                {weeklyTimetable.map((timetable) => (
                                    <button
                                        key={timetable.day}
                                        className={`px-4 py-2 mr-2 rounded-t-lg font-medium ${
                                            timetable.day === selectedDay 
                                                ? 'bg-blue-600 text-white' 
                                                : 'bg-gray-200 text-gray-700'
                                        }`}
                                        onClick={() => handleDayClick(timetable.day)}
                                    >
                                        {timetable.day}
                                    </button>
                                ))}
                            </div>

                            {/* Timetable for selected day */}
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                {weeklyTimetable.map((timetable) => (
                                    <div 
                                        key={timetable.day} 
                                        className={timetable.day === selectedDay ? '' : 'hidden'}
                                    >
                                        <div className="bg-blue-600 text-white px-6 py-4 flex justify-between">
                                            <h3 className="font-semibold">{timetable.day}</h3>
                                            <span>Class: {timetable.class}</span>
                                        </div>
                                        <div className="divide-y divide-gray-200">
                                            {timetable.periods.map((period, index) => (
                                                <div key={index} className="px-6 py-4 hover:bg-gray-50">
                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                        <div className="text-blue-600 font-medium">
                                                            {period.startTime} - {period.endTime}
                                                        </div>
                                                        <div className="font-semibold">{period.subject}</div>
                                                        <div>{period.teacher}</div>
                                                        <div className="text-gray-500">Room {period.room || 'N/A'}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                            No timetable available for this week
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}