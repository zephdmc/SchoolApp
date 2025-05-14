import React, { useState, useEffect } from 'react';
import {
  getAllClasses,
  createClass,
  updateClass,
  deleteClass,
} from '../../../services/ClassService';
import { getAllSessions } from '../../../services/SessionService';

const ClassManagementPage = () => {
  const [classes, setClasses] = useState([]); // State for class list
  const [sessions, setSessions] = useState([]); // State for session list
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    session: '',
  }); // State for form
  const [editingClassId, setEditingClassId] = useState(null); // State to track editing
  const [successMessage, setSuccessMessage] = useState(''); // State for success pop-up

  // Fetch all classes and sessions on component mount
  useEffect(() => {
    fetchClasses();
    fetchSessions();
  }, []);

  const fetchClasses = async () => {
    try {
      const data = await getAllClasses();
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

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
      if (editingClassId) {
        await updateClass(editingClassId, formData);
        showSuccessMessage('Class updated successfully!');
        setEditingClassId(null);
      } else {
        await createClass(formData);
        showSuccessMessage('Class created successfully!');
      }
      setFormData({ name: '', description: '', session: '' });
      fetchClasses();
    } catch (error) {
      console.error('Error saving class:', error);
    }
  };

  const handleEdit = (cls) => {
    setEditingClassId(cls._id);
    setFormData({
      name: cls.name,
      description: cls.description,
      session: cls.session,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteClass(id);
      fetchClasses();
      showSuccessMessage('Class deleted successfully!');
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Class Management</h1>

      {/* Success Notification */}
      {successMessage && (
        <div className="bg-green-500 text-white p-2 mb-4 rounded shadow-md text-center">
          {successMessage}
        </div>
      )}

      {/* Class Form */}
      <form onSubmit={handleCreateOrUpdate} className="mb-4">
        <input
          type="text"
          name="name"
          placeholder="Class Name"
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
        <select
          name="session"
          value={formData.session}
          onChange={handleInputChange}
          className="border p-2 mr-2"
          required
        >
          <option value="" disabled>
            Select Session
          </option>
          {sessions.map((session) => (
            <option key={session._id} value={session._id}>
              {session.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editingClassId ? 'Update Class' : 'Add Class'}
        </button>
      </form>

      {/* Class List */}
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Session</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr key={cls._id}>
              <td className="border p-2">{cls.name}</td>
              <td className="border p-2">{cls.description}</td>
              <td className="border p-2">
                {sessions.find((s) => s._id === cls.session)?.name || 'N/A'}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(cls)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cls._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {classes.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4">
                No classes available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClassManagementPage;
