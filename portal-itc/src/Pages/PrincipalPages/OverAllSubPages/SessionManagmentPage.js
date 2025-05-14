import React, { useState, useEffect } from 'react';
import {
  getAllSessions,
  createSession,
  updateSession,
  deleteSession,
} from '../../../services/SessionService';

const SessionManagementPage = () => {
  const [sessions, setSessions] = useState([]); // State for session list
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
  }); // State for form data
  const [editingSessionId, setEditingSessionId] = useState(null); // Track editing
  const [successMessage, setSuccessMessage] = useState(''); // State for success pop-up

  // Fetch all sessions on component mount
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const data = await getAllSessions();
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000); // Hide the message after 3 seconds
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingSessionId) {
        await updateSession(editingSessionId, formData);
        showSuccessMessage('Session updated successfully!');
        setEditingSessionId(null);
      } else {
        await createSession(formData);
        showSuccessMessage('Session created successfully!');
      }
      setFormData({ name: '', description: '', startDate: '', endDate: '' });
      fetchSessions();
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const handleEdit = (session) => {
    setEditingSessionId(session._id);
    setFormData({
      name: session.name,
      description: session.description,
      startDate: session.startDate.split('T')[0], // Format date for input
      endDate: session.endDate.split('T')[0],
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteSession(id);
      fetchSessions();
      showSuccessMessage('Session deleted successfully!');
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Session Management</h1>

      {/* Success Notification */}
      {successMessage && (
        <div className="bg-green-500 text-white p-2 mb-4 rounded shadow-md text-center">
          {successMessage}
        </div>
      )}

      {/* Session Form */}
      <form onSubmit={handleCreateOrUpdate} className="mb-4">
        <input
          type="text"
          name="name"
          placeholder="Session Name"
          value={formData.name}
          onChange={handleInputChange}
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
        <input
          type="date"
          name="startDate"
          placeholder="Start Date"
          value={formData.startDate}
          onChange={handleInputChange}
          className="border p-2 mr-2"
          required
        />
        <input
          type="date"
          name="endDate"
          placeholder="End Date"
          value={formData.endDate}
          onChange={handleInputChange}
          className="border p-2 mr-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editingSessionId ? 'Update Session' : 'Add Session'}
        </button>
      </form>

      {/* Session List */}
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Start Date</th>
            <th className="border p-2">End Date</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session._id}>
              <td className="border p-2">{session.name}</td>
              <td className="border p-2">{session.description}</td>
              <td className="border p-2">{session.startDate.split('T')[0]}</td>
              <td className="border p-2">{session.endDate.split('T')[0]}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(session)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(session._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {sessions.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No sessions available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SessionManagementPage;
