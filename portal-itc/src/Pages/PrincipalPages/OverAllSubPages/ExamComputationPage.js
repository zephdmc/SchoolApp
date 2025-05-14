import React, { useState, useEffect } from 'react';
import {
  getAllComputations,
  createComputation,
  updateComputation,
  deleteComputation,
} from '../../../services/examComputationService';
import { getAllClasses } from '../../../services/ClassService';
import { getAllTerms } from '../../../services/termService';

const ComputationManagementPage = () => {
  const [computations, setComputation] = useState([]); // State for computation list
      const [terms, setTerms] = useState([]); // State for term list
      const [classes, setClasses] = useState([]); // State for class list
  
  const [formData, setFormData] = useState({
    score: '',
    grade: '',
    class: '',
    comment: '',
    term: '',
  }); // State for form data
  const [editingComputationId, setEditingComputationId] = useState(null); // Track editing
  const [successMessage, setSuccessMessage] = useState(''); // State for computation pop-up

  // Fetch all computation on component mount
  useEffect(() => {
    fetchComputations();
  }, []);

  const fetchComputations = async () => {
    try {
      const data = await getAllComputations();
      setComputation(data);
    } catch (error) {
      console.error('Error fetching computation:', error);
    }
  };


  // Fetch all classes and sessions on component mount
  useEffect(() => {
    fetchClasses();
      fetchTerms();
  }, []);

  const fetchClasses = async () => {
    try {
      const data = await getAllClasses();
      setClasses(data);
    } catch (error) {
      console.error('Error fetching class:', error);
    }
    };


   const fetchTerms = async () => {
      try {
        const data = await getAllTerms();
        setTerms(data);
      } catch (error) {
        console.error('Error fetching Terms:', error);
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
      if (editingComputationId) {
        await updateComputation(editingComputationId, formData);
        showSuccessMessage('Computation updated successfully!');
        setEditingComputationId(null);
      } else {
        await createComputation(formData);
        showSuccessMessage('Session created successfully!');
      }
      setFormData({ class: '', score: '', grade: '', comment: '', term: '' });
      fetchComputations();
    } catch (error) {
      console.error('Error saving computation:', error);
    }
  };

  const handleEdit = (computation) => {
    setEditingComputationId(computation._id);
    setFormData({
      score: computation.score,
      class: computation.class,
      grade: computation.grade,
      comment: computation.comment.split('T')[0], // Format date for input
      term: computation.term.split('T')[0],
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteComputation(id);
      fetchComputations();
      showSuccessMessage('Computation deleted successfully!');
    } catch (error) {
      console.error('Error deleting computation:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Exam Computation Management</h1>

      {/* Success Notification */}
      {successMessage && (
        <div className="bg-green-500 text-white p-2 mb-4 rounded shadow-md text-center">
          {successMessage}
        </div>
      )}

      {/* Session Form */}
      <form onSubmit={handleCreateOrUpdate} className="mb-4">
        <input
          type="Number"
          name="score"
          placeholder="Score "
          value={formData.score}
          onChange={handleInputChange}
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          name="class"
          placeholder="class"
          value={formData.class}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
       <select
          name="term"
          value={formData.term}
          onChange={handleInputChange}
          className="border p-2 mr-2"
          required
        >
          <option value="" disabled>
            Select Term
          </option>
          {terms.map((term) => (
            <option key={term._id} value={term._id}>
              {term.name}
            </option>
          ))}
              </select>
              <select
          name="class"
          value={formData.class}
          onChange={handleInputChange}
          className="border p-2 mr-2"
          required
        >
          <option value="" disabled>
            Select Class
          </option>
          {classes.map((cl) => (
            <option key={cl._id} value={cl._id}>
              {cl.name}
            </option>
          ))}
              </select>
         <input
          type="text"
          name="grade"
          placeholder="grade"
          value={formData.grade}
          onChange={handleInputChange}
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          name="comment"
          placeholder="Comment"
          value={formData.comment}
          onChange={handleInputChange}
          className="border p-2 mr-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editingComputationId ? 'Update Computation' : 'Add Computation'}
        </button>
      </form>

<table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Score</th>
            <th className="border p-2">Class</th>
            <th className="border p-2">Comment</th>
            <th className="border p-2">Term</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {computations.map((computation) => {
            const className = classes.find(cl => cl._id === computation.class)?.name || "Unknown Class";
            const termName = terms.find(term => term._id === computation.term)?.name || "Unknown Term";

            return (
              <tr key={computation._id}>
                <td className="border p-2">{computation.score}</td>
                <td className="border p-2">{className}</td>
                <td className="border p-2">{computation.comment}</td>
                <td className="border p-2">{termName}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(computation)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(computation._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
          {computations.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No computation available.
              </td>
            </tr>
          )}
        </tbody>
      </table>




    </div>
  );
};

export default ComputationManagementPage;
