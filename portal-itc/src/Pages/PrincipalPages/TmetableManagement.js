import { useEffect, useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import axios from 'axios';
import { getAllClasses } from "../../services/ClassService";
import {getAllTerms} from "../../services/termService";
import { getAllSubject, } from '../../services/SubjectService';

  const TimetableAdmin = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('create');
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
    const [classes, setClasses] = useState([]);
    const [subjects, setSubject] = useState([]); // State for session list
    const [term, setTerm] = useState([]); // State for session list


  // Form state

const [formData, setFormData] = useState({
  class: '',
  term: '',
  day: '',
  date: '',
  periods: [{ subject: '', startTime: '', endTime: '' }] // Removed teacher
});

// 2. Modified handleChange to filter subjects when class changes
const handleChange = async (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });

  if (name === 'class') {
    try {
      const selectedClass = classes.find(cls => cls.name === value);
      if (selectedClass) {
        const classSubjects = subjects.filter(sub => sub.class === selectedClass._id);
        setSubject(classSubjects);
        
        // Reset subject selections when class changes
        const updatedPeriods = formData.periods.map(period => ({
          ...period,
          subject: ''
        }));
        setFormData(prev => ({
          ...prev,
          periods: updatedPeriods
        }));
      }
    } catch (error) {
      console.error('Error filtering subjects:', error);
    }
  }
};


 useEffect(() => {
  const fetchTimetables = async () => {
    try {
      setLoading(true);
      
      const res = await axios.get('/academic/api/timetable/admin/timetables', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        transformResponse: [data => {
          try {
            return JSON.parse(data);
          } catch (e) {
            throw new Error('Invalid JSON response');
          }
        }]
      });


      if (!Array.isArray(res.data)) {
        throw new Error('Expected array but got: ' + typeof res.data);
      }

      setTimetables(res.data);
      setError('');
    } catch (err) {
      console.error('Fetch error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError('Failed to load timetables. ' + err.message);
      setTimetables([]);
    } finally {
      setLoading(false);
    }
  };

  if (activeTab === 'view') fetchTimetables();
}, [activeTab, user.token]);


  // Handle period changes
  const handlePeriodChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPeriods = [...formData.periods];
    updatedPeriods[index][name] = value;
    setFormData({ ...formData, periods: updatedPeriods });
  };

    useEffect(() => {
      fetchSubjects();
      fetchClass();
      fetchTerm();
    }, []);
    
 



     const fetchClass = async () => {
      try {
        const response = await getAllClasses();
        setClasses(response || []);
      } catch (error) {
        console.error("Error fetching Teachers:", error);
        setError("Failed to fetch teachers");
        setClasses([]);
      }
    };

    const fetchSubjects = async () => {
      try {
        const data = await getAllSubject();
        setSubject(data);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
      };
    
      const fetchTerm = async () => {
        try {
          const data = await getAllTerms();
          setTerm(data);
        } catch (error) {
          console.error('Error fetching sessions:', error);
        }
        };
    
  // Add new period
  const addPeriod = () => {
    setFormData({
      ...formData,
      periods: [...formData.periods, { subject: '', teacher: '', startTime: '', endTime: '' }]
    });
  };

  // Remove period
  const removePeriod = (index) => {
    if (formData.periods.length > 1) {
      const updatedPeriods = formData.periods.filter((_, i) => i !== index);
      setFormData({ ...formData, periods: updatedPeriods });
    }
  };

  // Submit timetable
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('/academic/api/timetable/admin/timetable', formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setError('');
      setFormData({
        class: '',
        day: '',
        date: '',
        periods: [{ subject: '', teacher: '', startTime: '', endTime: '' }]
      });
      alert('Timetable created successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create timetable');
    } finally {
      setLoading(false);
    }
  };

  // Delete timetable
  const deleteTimetable = async (id) => {
    if (window.confirm('Are you sure you want to delete this timetable?')) {
      try {
        await axios.delete(`/academic/api/timetable/admin/timetable/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setTimetables(timetables.filter(t => t._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete timetable');
      }
    }
  };

  // Filter timetables based on search term
  const filteredTimetables = timetables.filter(t => 
    t.class.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.day.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Timetable Management</h1>
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'create' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('create')}
        >
          Create Timetable
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'view' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('view')}
        >
          View Timetables
        </button>
      </div>

      {/* Error message */}
      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">{error}</div>}

      {/* Create Timetable Form */}
      {activeTab === 'create' && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 mb-2">Class</label>
              <select
                name="class"
                value={formData.class}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls.name}>
              {cls.name}
            </option>
          ))}
                {/* Add more classes */}
              </select>

              

            </div>
            <div>
              <label className="block text-gray-700 mb-2">Term</label>
              <select
                name="term"
                value={formData.term}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Select Term</option>
          {term.map((tm) => (
            <option key={tm._id} value={tm.name}>
              {tm.name}
            </option>
          ))}
                {/* Add more classes */}
              </select>

              

            </div>
            <div>
              <label className="block text-gray-700 mb-2">Day</label>
              <select
                name="day"
                value={formData.day}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Select Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>

          <h3 className="text-lg font-medium mb-4">Periods</h3>
          
          {formData.periods.map((period, index) => (
  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-md">
    {/* Subject Selection */}
    <div>
      <label className="block text-gray-700 mb-1">Subject</label>
      <select
        name="subject"
        value={period.subject}
        onChange={(e) => handlePeriodChange(index, e)}
        className="w-full px-3 py-2 border rounded-md"
        required
        disabled={!formData.class}
      >
        <option value="">Select subject</option>
        {subjects
          .filter(sub => sub.class === (classes.find(cls => cls.name === formData.class)?._id || ''))
          .map((sub) => (
            <option key={sub._id} value={sub.name}>
              {sub.name}
            </option>
          ))
        }
      </select>
    </div>
    
    {/* Start Time */}
    <div>
      <label className="block text-gray-700 mb-1">Start Time</label>
      <input
        type="time"
        name="startTime"
        value={period.startTime}
        onChange={(e) => handlePeriodChange(index, e)}
        className="w-full px-3 py-2 border rounded-md"
        required
      />
    </div>
    
    {/* End Time */}
    <div className="flex items-end">
      <div className="flex-1">
        <label className="block text-gray-700 mb-1">End Time</label>
        <input
          type="time"
          name="endTime"
          value={period.endTime}
          onChange={(e) => handlePeriodChange(index, e)}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      {formData.periods.length > 1 && (
        <button
          type="button"
          onClick={() => removePeriod(index)}
          className="ml-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Remove
        </button>
      )}
    </div>
  </div>
))}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={addPeriod}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Add Period
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Timetable'}
            </button>
          </div>
        </form>
      )}

      {/* View Timetables */}
      {activeTab === 'view' && (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search by class or day..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border rounded-md"
      />
    </div>

    {loading ? (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    ) : error ? (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
        {error}
      </div>
    ) : filteredTimetables.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        {timetables.length === 0 
          ? "No timetables found in the system" 
          : "No timetables match your search"}
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periods</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTimetables.map((timetable) => (
              <tr key={timetable._id}>
                <td className="px-6 py-4 whitespace-nowrap">{timetable.class}</td>
                <td className="px-6 py-4 whitespace-nowrap">{timetable.term}</td>
                <td className="px-6 py-4 whitespace-nowrap">{timetable.day}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(timetable.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {timetable.periods.length}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteTimetable(timetable._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}
    </div>
  );
}


export default TimetableAdmin;