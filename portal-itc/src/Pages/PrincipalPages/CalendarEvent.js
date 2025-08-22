import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiCalendar, FiTrash2, FiEdit, FiPlus } from 'react-icons/fi';
import { getAllClasses } from "../../services/ClassService";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
const AdminCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    eventType: 'event',
    colorCode: '#3b82f6',
    targetAudience: 'all',
    specificClass: ''
  });
  const [classes, setClasses] = useState([]);
  const [view, setView] = useState('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchEvents();
    fetchClasses();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/academic/api/calendar/admin');
      // Ensure events is always an array
      setEvents(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch events');
      setEvents([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
        const res = await getAllClasses();
      // Ensure classes is always an array
      setClasses(Array.isArray(res) ? res: []);
    } catch (err) {
      toast.error('Failed to fetch classes');
      setClasses([]); // Set to empty array on error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert dates to ISO strings and prepare payload
      const payload = {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        eventType: formData.eventType,
        colorCode: formData.colorCode,
        targetAudience: formData.targetAudience,
        ...(formData.targetAudience === 'specific-class' && { 
          specificClass: formData.specificClass 
        })
      };
  
      const response = await axios.post('/academic/api/calendar', payload, {
        headers: {
          'Content-Type': 'application/json',
          // Add if using auth:
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      if (response.data.success) {
        toast.success('Event created successfully!');
        // Reset form
        setFormData({
          title: '',
          description: '',
          startDate: new Date(),
          endDate: new Date(),
          eventType: 'event',
          colorCode: '#3b82f6',
          targetAudience: 'all',
          specificClass: ''
        });
        fetchEvents();
        document.getElementById('event-modal').close(); // Add this line
      }
    } catch (err) {
      console.error('Detailed error:', err.response?.data);
      toast.error(
        err.response?.data?.message || 
        err.response?.data?.errors?.message || 
        'Event creation failed'
      );
    }
    };
    
    
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date, field) => {
    setFormData({ ...formData, [field]: date });
  };

  const deleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`/academic/api/calendar/${id}`);
        toast.success('Event deleted successfully');
        fetchEvents();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete event');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">School Calendar Management</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-md ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            List View
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`px-4 py-2 rounded-md ${view === 'calendar' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Calendar View
          </button>
        </div>
        <button
          onClick={() => document.getElementById('event-modal').showModal()}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <FiPlus className="mr-2" /> Add Event
        </button>
      </div>

      {/* Event Creation Modal */}
      <dialog id="event-modal" className="modal">
        <div className="modal-box max-w-3xl p-6">
          <h3 className="font-bold text-lg mb-4">Create New Calendar Event</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-1">Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Event Type</label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="event">General Event</option>
                  <option value="holiday">Holiday</option>
                  <option value="exam">Exam</option>
                  <option value="meeting">Meeting</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-1">Start Date</label>
                <DatePicker
                  selected={formData.startDate}
                  onChange={(date) => handleDateChange(date, 'startDate')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">End Date</label>
                <DatePicker
                  selected={formData.endDate}
                  onChange={(date) => handleDateChange(date, 'endDate')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  minDate={formData.startDate}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-1">Color</label>
                <input
                  type="color"
                  name="colorCode"
                  value={formData.colorCode}
                  onChange={handleInputChange}
                  className="w-full h-10"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Audience</label>
                <select
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">Everyone</option>
                  <option value="students">Students Only</option>
                  <option value="staff">Staff Only</option>
                  <option value="specific-class">Specific Class</option>
                </select>
              </div>
            </div>

            {formData.targetAudience === 'specific-class' && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Select Class</label>
                <select
                  name="specificClass"
                  value={formData.specificClass}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls._id} value={cls._id}>{cls.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => document.getElementById('event-modal').close()}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {view === 'list' ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audience</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(events) && events.length > 0 ? (
                events.map(event => (
                  <tr key={event._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: event.colorCode || '#3b82f6' }}
                        ></div>
                        <div className="font-medium">{event.title || 'Untitled Event'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{event.eventType || 'event'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {event.startDate ? new Date(event.startDate).toLocaleString() : 'N/A'} -<br />
                      {event.endDate ? new Date(event.endDate).toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">
                      {event.targetAudience || 'all'}
                      {event.specificClass?.name && ` (${event.specificClass.name})`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => deleteEvent(event._id)}
                        className="text-red-600 hover:text-red-900 mr-3"
                      >
                        <FiTrash2 />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        <FiEdit />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    {loading ? 'Loading events...' : 'No events found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
    <div className="mb-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold">
        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </h2>
      <div className="flex space-x-2">
        <button 
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Previous
        </button>
        <button 
          onClick={() => setCurrentMonth(new Date())}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Today
        </button>
        <button 
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    </div>
    
    <Calendar
      value={currentMonth}
      onChange={setCurrentMonth}
      tileContent={({ date, view }) => {
        if (view === 'month') {
          const dayEvents = events.filter(event => {
            const eventDate = new Date(event.startDate);
            return (
              eventDate.getDate() === date.getDate() &&
              eventDate.getMonth() === date.getMonth() &&
              eventDate.getFullYear() === date.getFullYear()
            );
          });
          
          return (
            <div className="absolute top-0 left-0 right-0 p-1">
              {dayEvents.map(event => (
                <div 
                  key={event._id} 
                  className="text-xs truncate p-1 mb-1 rounded"
                  style={{ backgroundColor: event.colorCode || '#3b82f6', color: 'white' }}
                >
                  {event.title}
                </div>
              ))}
            </div>
          );
        }
      }}
    />
    
    <div className="mt-6">
      <h3 className="font-semibold mb-2">Events this month</h3>
      {events.filter(event => {
        const eventDate = new Date(event.startDate);
        return (
          eventDate.getMonth() === currentMonth.getMonth() &&
          eventDate.getFullYear() === currentMonth.getFullYear()
        );
      }).length > 0 ? (
        <ul className="space-y-2">
          {events
            .filter(event => {
              const eventDate = new Date(event.startDate);
              return (
                eventDate.getMonth() === currentMonth.getMonth() &&
                eventDate.getFullYear() === currentMonth.getFullYear()
              );
            })
            .map(event => (
              <li key={event._id} className="flex items-center p-2 border rounded">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: event.colorCode || '#3b82f6' }}
                ></div>
                <div>
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(event.startDate).toLocaleString()} - {new Date(event.endDate).toLocaleString()}
                  </div>
                </div>
              </li>
            ))
          }
        </ul>
      ) : (
        <p className="text-gray-500">No events scheduled for this month</p>
      )}
    </div>
  </div>
      )}
    </div>
  );
};

export default AdminCalendar;