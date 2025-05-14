import React, { useState, useEffect } from 'react';
import {
  getAllTerms,
  createTerm,
  updateTerm,
  deleteTerm,
} from '../../../services/termService';
import { getAllSessions } from '../../../services/SessionService';

const TermManagementPage = () => {
  const [terms, setTerms] = useState([]); // State for terms list
  const [sessions, setSessions] = useState([]); // State for session list
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    session: '',
  }); // State for form
  const [editingTermId, setEditingTermId] = useState(null); // State to track editing
  const [successMessage, setSuccessMessage] = useState(''); // State for success pop-up

  // Fetch all terms and sessions on component mount
  useEffect(() => {
    fetchTerms();
    fetchSessions();
  }, []);

  const fetchTerms = async () => {
    try {
      const data = await getAllTerms();
      setTerms(data);
    } catch (error) {
      console.error('Error fetching Terms:', error);
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
      if (editingTermId) {
        await updateTerm(editingTermId, formData);
        showSuccessMessage('Term updated successfully!');
        setEditingTermId(null);
      } else {
        await createTerm(formData);
        showSuccessMessage('Term created successfully!');
      }
      setFormData({ name: '', description: '', session: '' });
      fetchTerms();
    } catch (error) {
      console.error('Error saving term:', error);
    }
  };

  const handleEdit = (cls) => {
    setEditingTermId(cls._id);
    setFormData({
      name: cls.name,
      description: cls.description,
      session: cls.session,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteTerm(id);
      fetchTerms();
      showSuccessMessage('Term deleted successfully!');
    } catch (error) {
      console.error('Error deleting Term:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Term Management</h1>

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
          {editingTermId ? 'Update Class' : 'Add Class'}
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
          {terms.map((cls) => (
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
          {terms.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4">
                No Terms available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TermManagementPage;
