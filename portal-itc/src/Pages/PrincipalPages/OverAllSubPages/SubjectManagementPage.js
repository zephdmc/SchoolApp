import React, { useState, useEffect, useContext } from 'react';
import {
    getAllSubject,
    createSubject,
  updateSubject, 
  deleteSubject,
} from '../../../services/SubjectService';
import { getAllSessions } from '../../../services/SessionService';
import { getAllTeachers } from '../../../services/teacherService';
import { getAllClasses } from '../../../services/ClassService';
import { getAllTerms } from '../../../services/termService';
import AuthContext from '../../../context/AuthContext';


const SubjectManagementPage = () => {
  const [classes, setClasses] = useState([]); // State for class list
    const [sessions, setSessions] = useState([]); // State for session list
    const [subjects, setSubject] = useState([]); // State for session list
    const [terms, setTerm] = useState([]); // State for term list

    const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
      session: '',
      teacher: '',
      class: '' ,
      term: '' ,
  }); // State for form
    const [editingSubjectId, setEditingSubjectId] = useState(null); // State to track editing
    const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllTeachers();
      console.log(data)
      setUsers(data.data);
    };

    fetchUsers();
  }, [user]);

  // Fetch all classes and sessions on component mount
  useEffect(() => {
    fetchClasses();
      fetchSessions();
      fetchSubjects();
      fetchTerms();
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
    
    
  const fetchTerms = async () => {
    try {
      const data = await getAllTerms();
      setTerm(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
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
    
    

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingSubjectId) {
        await updateSubject(editingSubjectId, formData);
        setEditingSubjectId(null);
      } else {
        await  createSubject(formData);
      }
      setFormData({ name: '', code: '', session: '',  teacher: '',  class: '', term: '' });
      fetchSubjects();
    } catch (error) {
      console.error('Error saving class:', error);
    }
  };

  const handleEdit = (cls) => {
    setEditingSubjectId(cls._id);
    setFormData({
      name: cls.name,
      code: cls.code,
        session: cls.session,
        teacher: cls.teacher,
        class: cls.class,
        term: cls.term,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteSubject(id);
      fetchSubjects();
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Subject Management</h1>

      {/* Class Form */}
      <form onSubmit={handleCreateOrUpdate} className="mb-4">
        <input
          type="text"
          name="name"
          placeholder="Subject Name"
          value={formData.name}
          onChange={handleInputChange}
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          name="code"
          placeholder="code"
          value={formData.code}
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


              <select
  name="teacher"
  value={formData.teacher}
  onChange={handleInputChange}
  className="border p-2 mr-2"
  required
>
  <option value="" disabled>
    Select Teacher
  </option>
  {Array.isArray(users) && users.length > 0 ? (
    users.map((teacher) => (
      <option key={teacher._id} value={teacher.teacherID}>
        {teacher.firstName} {teacher.lastName}
      </option>
    ))
  ) : (
    <option value="" disabled>
      No teachers available
    </option>
  )}
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
          {terms.map((cl) => (
            <option key={cl._id} value={cl._id}>
              {cl.name}
            </option>
          ))}
              </select>



        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editingSubjectId ? 'Update Class' : 'Add Class'}
        </button>
      </form>

      {/* Class List */}
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Description</th>
                      <th className="border p-2">Session</th>
                      <th className="border p-2">Class</th>
                      <th className="border p-2">Staff</th>
                      <th className="border p-2">Term</th>

            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((cls) => (
            <tr key={cls._id}>
              <td className="border p-2">{cls.name}</td>
              <td className="border p-2">{cls.code}</td>
              <td className="border p-2">
                {sessions?.find((s) => s._id === cls.session)?.name || 'N/A'}
                  </td>
                  <td className="border p-2">
                {classes?.find((s) => s._id === cls.class)?.name || 'N/A'}
                  </td>
                  <td className="border p-2">
                {/* {users?.find((s) => s._id === cls.teacher)?.username || 'N/A'} */}

                {Array.isArray(users) ? users.find((s) => s._id === cls.teacher)?.staffNumber || 'N/A' : 'N/A'}
              </td>
              <td className="border p-2">
                {terms?.find((s) => s._id === cls.term)?.name || 'N/A'}
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
          {subjects.length === 0 && (
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

export default SubjectManagementPage;
