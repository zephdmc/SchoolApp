import React, { useEffect, useState, useContext } from 'react';
import {
  createStudent,
  getAllStudents,
  updateStudent,
  deleteStudent,
} from "../../services/studentService";
import { getAllClasses } from "../../services/ClassService";
import { getAllSessions } from "../../services/SessionService";
import AuthContext from "../../context/AuthContext";
import { updateEnroll, getAllUsersNotEnroll } from "../../services/userService";

const StudentsReg = () => {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [studentsNotEnroll, setUserNotEnroll] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 20;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  
  const [form, setForm] = useState({
    studentID: "",
    firstName: "",
    lastName: "",
    middleName: "",
    gender: "",
    admissionNumber: "",
    class: "",
    section: "",
    status: "Active",
    session: ""
  });

  useEffect(() => {
    fetchStudents();
    fetchClasses();
    fetchSessions();
    fetchUsers();
  }, []);

  const resetForm = () => {
    setForm({
      studentID: "",
      firstName: "",
      lastName: "",
      middleName: "",
      gender: "",
      admissionNumber: "",
      class: "",
      section: "",
      status: "Active",
      session: ""
    });
    setEditId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateEnroll = async (userId) => {
    try {
      const response = await updateEnroll(userId);
      setError(response.message);
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating enroll');
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await getAllStudents();
      setStudents(response?.data || []);
      setFilteredStudents(response?.data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to fetch students");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getAllUsersNotEnroll(user.token);
      setUserNotEnroll(response?.data?.students || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Unenrolled students not available");
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await getAllClasses();
      setClasses(response || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setError("Failed to fetch classes");
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await getAllSessions();
      setSessions(response || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setError("Failed to fetch sessions");
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query) {
      setFilteredStudents(
        students.filter(
          (student) =>
            student.firstName.toLowerCase().includes(query) ||
            student.lastName.toLowerCase().includes(query) ||
            student.admissionNumber.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredStudents(students);
    }
  };

  const handleClassFilter = (e) => {
    const selectedClass = e.target.value;
    setSelectedClass(selectedClass);

    if (selectedClass) {
      setFilteredStudents(students.filter((student) => student.class === selectedClass));
    } else {
      setFilteredStudents(students);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = { ...form };
  
      if (editId) {
        await updateStudent(editId, formData);
      } else {
        await createStudent(formData);
        const userIdToEnroll = formData?.studentID;
        if (userIdToEnroll) {
          await handleUpdateEnroll(userIdToEnroll);
        }
      }
  
      await fetchStudents();
      await fetchUsers();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.response?.data?.error || "Registration failed. Please check all fields.");
    }
  };

  const handleEdit = (student) => {
    setForm(student);
    setEditId(student._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(id);
        fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
        setError("Failed to delete student");
      }
    }
  };

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl md:text-2xl font-bold mb-4">Student Registration</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm md:text-base">
          {error}
        </div>
      )}

      {/* Top Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by name or admission number"
          value={searchQuery}
          onChange={handleSearch}
          className="border p-2 w-full md:w-1/3 rounded text-sm md:text-base"
        />
        <select
          value={selectedClass}
          onChange={handleClassFilter}
          className="border p-2 w-full md:w-1/3 rounded text-sm md:text-base"
        >
          <option value="">Filter by Class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-itccolor text-white px-4 py-2 rounded w-full md:w-auto hover:bg-red-600 transition text-sm md:text-base"
        >
          Register Student
        </button>
      </div>

      {/* Student Count */}
      <div className="bg-gray-200 p-4 rounded mb-4">
        <h2 className="text-lg font-bold text-sm md:text-base">Total Students: {students.length}</h2>
      </div>

      {/* Student List */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-sm md:text-base">First Name</th>
              <th className="border p-2 text-sm md:text-base">Last Name</th>
              <th className="border p-2 text-sm md:text-base">Admission Number</th>
              <th className="border p-2 text-sm md:text-base">Class</th>
              <th className="border p-2 text-sm md:text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.length > 0 ? (
              currentStudents.map((student) => (
                <tr key={student._id}>
                  <td className="border p-2 text-sm md:text-base">{student.firstName}</td>
                  <td className="border p-2 text-sm md:text-base">{student.lastName}</td>
                  <td className="border p-2 text-sm md:text-base">{student.admissionNumber}</td>
                  <td className="border p-2 text-sm md:text-base">
                    {classes.find(c => c._id === student.class)?.name || student.class}
                  </td>
                  <td className="border p-2 text-sm md:text-base">
                    <button 
                      onClick={() => handleEdit(student)} 
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600 transition text-xs md:text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(student._id)} 
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition text-xs md:text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="border p-2 text-center text-sm md:text-base">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredStudents.length > studentsPerPage && (
        <div className="flex justify-center mt-4">
          {[...Array(Math.ceil(filteredStudents.length / studentsPerPage))].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 mx-1 rounded text-sm md:text-base ${
                currentPage === index + 1 ? "bg-itccolor text-white" : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-sm md:text-base">
              {editId ? "Edit Student" : "Register Student"}
            </h2>
            
            <form onSubmit={handleSubmit} className="mb-4">
              <div className="grid grid-cols-1 gap-4">
                {/* Only show student dropdown during registration, not edit */}
                {!editId && (
                  <div>
                    <label className="block text-sm md:text-base mb-1">Student Username</label>
                    <select 
                      name="studentID" 
                      value={form.studentID} 
                      onChange={handleChange} 
                      required 
                      className="w-full border p-2 rounded text-sm md:text-base"
                    >
                      <option value="">Select Student</option>
                      {studentsNotEnroll.map((student) => (
                        <option key={student._id} value={student._id}>
                          {student.username} 
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm md:text-base mb-1">First Name</label>
                  <input 
                    type="text" 
                    name="firstName" 
                    value={form.firstName} 
                    onChange={handleChange} 
                    placeholder="First Name" 
                    required 
                    className="w-full border p-2 rounded text-sm md:text-base" 
                  />
                </div>

                <div>
                  <label className="block text-sm md:text-base mb-1">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName" 
                    value={form.lastName} 
                    onChange={handleChange} 
                    placeholder="Last Name" 
                    required 
                    className="w-full border p-2 rounded text-sm md:text-base" 
                  />
                </div>

                <div>
                  <label className="block text-sm md:text-base mb-1">Middle Name</label>
                  <input 
                    type="text" 
                    name="middleName" 
                    value={form.middleName} 
                    onChange={handleChange} 
                    placeholder="Middle Name" 
                    className="w-full border p-2 rounded text-sm md:text-base" 
                  />
                </div>

                <div>
                  <label className="block text-sm md:text-base mb-1">Gender</label>
                  <select 
                    name="gender" 
                    value={form.gender} 
                    onChange={handleChange} 
                    required 
                    className="w-full border p-2 rounded text-sm md:text-base"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm md:text-base mb-1">Admission Number</label>
                  <input 
                    type="text" 
                    name="admissionNumber" 
                    value={form.admissionNumber} 
                    onChange={handleChange} 
                    placeholder="Admission Number" 
                    required 
                    className="w-full border p-2 rounded text-sm md:text-base" 
                  />
                </div>

                <div>
                  <label className="block text-sm md:text-base mb-1">Class</label>
                  <select 
                    name="class" 
                    value={form.class} 
                    onChange={handleChange} 
                    required 
                    className="w-full border p-2 rounded text-sm md:text-base"
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
                  <label className="block text-sm md:text-base mb-1">Section</label>
                  <input 
                    type="text" 
                    name="section" 
                    value={form.section} 
                    onChange={handleChange} 
                    placeholder="Section" 
                    className="w-full border p-2 rounded text-sm md:text-base" 
                  />
                </div>

                <div>
                  <label className="block text-sm md:text-base mb-1">Session</label>
                  <select 
                    name="session" 
                    value={form.session} 
                    onChange={handleChange} 
                    required 
                    className="w-full border p-2 rounded text-sm md:text-base"
                  >
                    <option value="">Select Session</option>
                    {sessions.map((session) => (
                      <option key={session._id} value={session._id}>
                        {session.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button 
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }} 
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition text-sm md:text-base"
                >
                  Cancel
                </button>
                
                <button 
                  type="submit" 
                  className="bg-itccolor text-white px-4 py-2 rounded hover:bg-red-800 transition text-sm md:text-base"
                >
                  {editId ? "Update" : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsReg;