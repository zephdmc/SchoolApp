import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getAllClasses } from "../../services/ClassService";
import { getAllSubject } from '../../services/SubjectService';
import { getAllTeachers } from "../../services/teacherService";
import { getAllSessions } from '../../services/SessionService';
import { getAllTerms } from '../../services/termService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AdminExamTimetable = () => {
    const [timetables, setTimetables] = useState([]);
  const [classes, setClasses] = useState([]);
  const [term, setTerm] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [filteredSubjects, setFilteredSubjects] = useState([]);
   // In your component state initialization
const [formData, setFormData] = useState({
  class: null, // Changed from empty string to null
  term: '',
  examName: '',
  academicYear: `${new Date().getFullYear()}/${new Date().getFullYear()+1}`, // Default to current academic year
  schedule: []
});
    const [newScheduleItem, setNewScheduleItem] = useState({
      date: new Date(),
      subject: '',
      startTime: '09:00',
      endTime: '12:00',
      room: '',
      supervisor: '',
      notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('create');
    const navigate = useNavigate();
  
    useEffect(() => {
      fetchTimetables();
      fetchClasses();
      fetchTerm();
      fetchSubjects();
      fetchTeachers();
      fetchSessions();
    }, []);
  
    const fetchTimetables = async () => {
      try {
        console.log('Fetching timetables from /admin endpoint');
        const res = await axios.get('/academic/api/examtimetable/admin', {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        console.log('Timetables fetched successfully:', res.data);
        setTimetables(res.data || []);
      } catch (err) {
        console.error('Detailed fetch error:', {
          message: err.message,
          config: err.config,
          response: err.response?.data
        });
        
        toast.error(
          err.response?.data?.message || 
          'Failed to fetch timetables. Please check console for details.'
        );
        setTimetables([]);
      }
    };
      
    const deleteTimetable = async (id) => {
      try {
        if (window.confirm('Are you sure you want to delete this timetable?')) {
          await axios.delete(`/academic/api/examtimetable/${id}`);
          toast.success('Timetable deleted successfully');
          fetchTimetables(); // Refresh the list
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete timetable');
      }
    };
  
    const fetchClasses = async () => {
      try {
          const res = await getAllClasses();
        setClasses(res || []);
      } catch (err) {
        toast.error('Failed to fetch classes');
        setClasses([]);
      }
  };
  

  const fetchTerm = async () => {
    try {
        const res = await getAllTerms();
      setTerm(res || []);
    } catch (err) {
      toast.error('Failed to fetch term');
      setTerm([]);
    }
  };
  
  // 3. Modify your fetchSubjects to initialize filteredSubjects
const fetchSubjects = async () => {
    try {
      const res = await getAllSubject();
      const subjectsData = res ? res : Array.isArray(res) ? res : [];
      setSubjects(subjectsData);
      // Initialize filtered subjects if a class is already selected
      if (formData.class) {
        setFilteredSubjects(subjectsData.filter(subject => subject.class === formData.class));
      } else {
        setFilteredSubjects([]);
      }
    } catch (err) {
      toast.error('Failed to fetch subjects');
      setSubjects([]);
      setFilteredSubjects([]);
    }
  };
  
    const fetchSessions = async () => {
      try {
          const res = await getAllSessions();
        setSessions(res || []);
      } catch (err) {
        toast.error('Failed to fetch sessions');
        setSessions([]);
      }
    };
  
    const fetchTeachers = async () => {
      try {
          const res = await getAllTeachers();
        setTeachers(res.data || []);
      } catch (err) {
        toast.error('Failed to fetch teachers');
        setTeachers([]);
      }
    };

// Update handleInputChange for class selection
const handleInputChange = (e) => {
  const { name, value } = e.target;
  if (name === 'class') {
  const selectedClass = classes.find(c => c._id === value);
  setFormData({ ...formData, class: selectedClass });

  const filtered = subjects.filter(subject => subject.class === value);
  setFilteredSubjects(filtered);
} else if (name === 'term') {
  const selectedTerm = term.find(t => t._id === value);
  setFormData({ ...formData, term: selectedTerm });
} else {
  setFormData({ ...formData, [name]: value });
}
  // if (name === 'class') {
  //   const selectedClass = classes.find(c => c._id === value);
  //   setFormData({ 
  //     ...formData, 
  //     class: selectedClass // Store the entire class object
  //   });
  //   // Filter subjects when class changes
  //   const filtered = subjects.filter(subject => subject.class === value);
  //   setFilteredSubjects(filtered);
  // } else {
  //   setFormData({ ...formData, [name]: value });
  // }
};

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setNewScheduleItem({ ...newScheduleItem, [name]: value });
  };

// In your addScheduleItem function:
const addScheduleItem = () => {
  if (!newScheduleItem.subject || !newScheduleItem.date) {
    toast.warning('Subject and date are required');
    return;
  }

  const subjectObj = filteredSubjects.find(s => s._id === newScheduleItem.subject);

  setFormData({
    ...formData,
    schedule: [
      ...formData.schedule, 
      {
        ...newScheduleItem,
        subject: newScheduleItem.subject, // Keep ID for selection
        supervisor: newScheduleItem.supervisor // Store name directly
      }
    ]
  });

  // Reset new schedule item
  setNewScheduleItem({
    date: new Date(),
    subject: '',
    startTime: '09:00',
    endTime: '12:00',
    room: '',
    supervisor: '', // This will store the name directly
    notes: ''
  });
};

  const removeScheduleItem = (index) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule.splice(index, 1);
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Prepare payload with names instead of IDs
    const payload = {
      className: formData.class?.name || '',
      term: formData.term?.name,
      examName: formData.examName,
      academicYear: formData.academicYear,
      schedule: formData.schedule.map(item => ({
        date: item.date.toISOString().split('T')[0],
        subjectName: filteredSubjects.find(s => s._id === item.subject)?.name || '',
        startTime: item.startTime,
        endTime: item.endTime,
        room: item.room,
        supervisorName: item.supervisor,
        notes: item.notes
      }))
    };
  
    try {
      const response = await axios.post('/academic/api/examtimetable', payload);
      
      // Add these success handling lines:
      console.log('Creation successful:', response.data);
      toast.success('Exam timetable created successfully!');
      
      // Reset form
      setFormData({
        class: null,
        examName: '',
        academicYear: `${new Date().getFullYear()}/${new Date().getFullYear()+1}`,
        schedule: []
      });
      
      // Refresh the timetables list
      await fetchTimetables();
      setActiveTab('view');
      
    } catch (err) {
      console.error('Submission error:', err);
      console.error('Error response:', err.response);
      toast.error(err.response?.data?.message || 'Failed to create timetable');
    } finally {
      setLoading(false);
    }
  };

  const publishTimetable = async (id) => {
    try {
      await axios.patch(`/academic/api/examtimetable/${id}/publish`);
      toast.success('Timetable published successfully');
      fetchTimetables();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish timetable');
    }
  };

  return (
     <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Exam Timetable Management</h1>
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'create' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('create')}
        >
          Create New
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'view' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('view')}
        >
          View Timetables
        </button>
      </div>

      {/* Create Timetable Form */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Create New Exam Timetable</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="class">
                  Class
                </label>
                <select
                  id="class"
                  name="class"
                  value={formData.class?._id || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="class">
                  Term
                </label>
                <select
                  id="term"
                  name="term"
                  value={formData.term?._id || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Term</option>
                  {term.map((tm) => (
                    <option key={tm._id} value={tm._id}>
                      {tm.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="examName">
                  Exam Name
                </label>
                <input
                  type="text"
                  id="examName"
                  name="examName"
                  value={formData.examName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Mid-Term Exams 2023"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="academicYear">
                  Academic Year
                </label>
                <select
                  id="academicYear"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Academic Year</option>
                  {sessions.map((session) => (
                    <option key={session._id} value={session.name}>
                    {session.name}
                  </option>
                  ))}
                </select>
                  </div>
                      </div>
                   
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Exam Schedule</h3>
              
              {/* Schedule Item Form */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Date</label>
                    <DatePicker
                      selected={newScheduleItem.date}
                      onChange={(date) => setNewScheduleItem({...newScheduleItem, date})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      dateFormat="MMMM d, yyyy"
                      minDate={new Date()}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">Subject</label>
                    <select
  name="subject"
  value={newScheduleItem.subject}
  onChange={handleScheduleChange}
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  required
  disabled={!formData.class} // Disable if no class selected
>
  <option value="">Select Subject</option>
  {filteredSubjects.length > 0 ? (
    filteredSubjects.map((subject) => (
      <option key={subject._id} value={subject._id}>
        {subject.name}
      </option>
    ))
  ) : (
    <option value="" disabled>
      {formData.class ? 'No subjects found for this class' : 'Select a class first'}
    </option>
  )}
</select>
                  </div>
                                    <div>
                    <label className="block text-gray-700 mb-1">Supervisor</label>
                    <select
                      name="supervisor"
                      value={newScheduleItem.supervisor}
                      onChange={handleScheduleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Supervisor</option>
                      {teachers.map((teacher) => (
                        <option key={teacher._id} value={teacher.name}>
                          {teacher.firstName} {teacher.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      name="startTime"
                      value={newScheduleItem.startTime}
                      onChange={handleScheduleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      name="endTime"
                      value={newScheduleItem.endTime}
                      onChange={handleScheduleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">Room</label>
                    <input
                      type="text"
                      name="room"
                      value={newScheduleItem.room}
                      onChange={handleScheduleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Room number"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">Notes</label>
                  <input
                    type="text"
                    name="notes"
                    value={newScheduleItem.notes}
                    onChange={handleScheduleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional notes"
                  />
                </div>
                
                <button
                  type="button"
                  onClick={addScheduleItem}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Add to Schedule
                </button>
              </div>
              
              {/* Schedule Items List */}
              {formData.schedule.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formData.schedule.map((item, index) => {
                        const subject = subjects.find(s => s._id === item.subject);
                        return (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {new Date(item.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {subject?.name || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.startTime} - {item.endTime}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.room || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => removeScheduleItem(index)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No schedule items added yet
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || formData.schedule.length === 0}
              className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors ${(loading || formData.schedule.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creating...' : 'Create Exam Timetable'}
            </button>
          </form>
        </div>
      )}

      {/* View Timetables */}
      {activeTab === 'view' && (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-semibold mb-4 text-gray-700">Exam Timetables</h2>
    
    {Array.isArray(timetables) && timetables.length > 0 ? (
      <div className="space-y-6">
        {timetables.map((timetable) => (
          <div key={timetable._id} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{timetable.examName}</h3>
                <p className="text-gray-600">
                  Class: {timetable.className} | 
                  Academic Year: {timetable.academicYear}
                </p>
              </div>
              <div>
                {!timetable.published ? (
                  <> 
                  <button
                    onClick={() => publishTimetable(timetable._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors"
                  >
                    Publish
                    </button>
                    <button
                      onClick={() => deleteTimetable(timetable._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                    </>
                ) : (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm">
                    Published
                  </span>
                )}
              </div>
            </div>
            
            {timetable.schedule?.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {timetable.schedule.map((item, index) => (
                  <div key={index} className="px-6 py-4 hover:bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="font-medium">
                        {item.date ? new Date(item.date).toLocaleDateString() : 'No date'}
                      </div>
                      <div className="font-semibold">
                        {item.subjectName || 'N/A'}
                      </div>
                      <div className="text-blue-600">
                        {item.startTime} - {item.endTime}
                      </div>
                      <div>Room: {item.room || 'N/A'}</div>
                      <div>
                        {item.supervisorName ? `Supervisor: ${item.supervisorName}` : ''}
                      </div>
                    </div>
                    {item.notes && (
                      <div className="mt-2 text-sm text-gray-500">
                        Notes: {item.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                No schedule items for this timetable
              </div>
            )}
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8 text-gray-500">
        No exam timetables created yet
      </div>
    )}
  </div>
)}
    </div>
  );
};

export default AdminExamTimetable;