import React, { useEffect, useState, useContext } from "react";
import {
  createTeacher,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
} from "../../services/teacherService";
import AuthContext from "../../context/AuthContext";
import {
  updateEnroll,
  getAllTeachersUsersNotEnroll,
} from "../../services/userService";

const TeachersReg = () => {
  const { user } = useContext(AuthContext);
  const [teachers, setTeachers] = useState([]);
  const [teachersNotEnroll, setUserNotEnroll] = useState([]);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 20;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  
  const [form, setForm] = useState({
    teacherID: "",
    firstName: "",
    lastName: "",
    middleName: "",
    gender: "",
    employmentType: ""
  });

  useEffect(() => {
    fetchTeachers();
    fetchUsers();
  }, []);

  const resetForm = () => {
    setForm({
      teacherID: "",
      firstName: "",
      lastName: "",
      middleName: "",
      gender: "",
      employmentType: ""
    });
    setEditId(null);
  };

  const fetchTeachers = async () => {
    try {
      const response = await getAllTeachers();
      setTeachers(response?.data || []);
      setTotalTeachers(response?.data?.length || 0);
    } catch (error) {
      console.error("Error fetching Teachers:", error);
      setError("Failed to fetch teachers");
      setTeachers([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getAllTeachersUsersNotEnroll(user.token);
      setUserNotEnroll(response || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setError("Failed to fetch unenrolled teachers");
      setUserNotEnroll([]);
    }
  };

  const handleUpdateEnroll = async (userId) => {
    try {
      const response = await updateEnroll(userId);
      setError(response.message);
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating enroll');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // editing existing teacher
        await updateTeacher(editId, form, user.token); // include token if needed
        setError(null);
      } else {
        // minimal data for new teacher
        const teacherData = {
          
          teacherID: form.teacherID,
          firstName: form.firstName,
          lastName: form.lastName,
          middleName: form.middleName,
          gender: form.gender,
          employmentType: form.employmentType,
          // Add these default values
          status: "Active",
          nationality: "Nigerian",
          admissionDate: new Date()

        };
  
        // create teacher
        const createResponse = await createTeacher(teacherData, user.token);
        const createdTeacher = createResponse?.data?.teacher || createResponse?.data;
  
        if (createdTeacher && (createdTeacher._id || createdTeacher.teacherID)) {
          // enroll user; decide whether enroll uses _id or teacherID
          const userIdToEnroll = createdTeacher.teacherID; // or createdTeacher._id if that's what's expected
          await handleUpdateEnroll(userIdToEnroll);
        } else {
          throw new Error("Teacher creation failed: missing identifier");
        }
      }
  
      // refresh and cleanup
      await fetchTeachers();
      await fetchUsers();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to save teacher. Please check all fields."
      );
    }
  };
  

  const handleEdit = (teacher) => {
    setForm(teacher);
    setEditId(teacher._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Teacher?")) {
      try {
        await deleteTeacher(id);
        fetchTeachers();
      } catch (error) {
        console.error("Error deleting teacher:", error);
        setError("Failed to delete teacher");
      }
    }
  };

  const filteredTeachers = teachers.filter((teacher) =>
    [teacher.firstName, teacher.lastName]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * teachersPerPage,
    currentPage * teachersPerPage
  );

  return (
    <div className="container mx-auto p-4">
      {/* Header Section with Cards */}
      <div className="m-4">
        <div className="bg-gray-300 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Teachers</h2>
          <p className="text-2xl font-bold">{totalTeachers}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Top Bar: Search & Register Button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search by First Name or Last Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 w-full md:w-1/3 rounded-lg text-sm md:text-base"
        />
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-itccolor text-white px-4 py-2 rounded-lg w-full md:w-auto hover:bg-red-800 transition text-sm md:text-base"
        >
          Register Teacher
        </button>
      </div>

      {/* Teachers List */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-sm md:text-base">First Name</th>
              <th className="border p-2 text-sm md:text-base">Last Name</th>
              <th className="border p-2 text-sm md:text-base">Gender</th>
              <th className="border p-2 text-sm md:text-base">Employment Type</th>
              <th className="border p-2 text-sm md:text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTeachers.length > 0 ? (
              paginatedTeachers.map((teacher) => (
                <tr key={teacher._id} className="border hover:bg-gray-50">
                  <td className="p-2 text-sm md:text-base">{teacher.firstName}</td>
                  <td className="p-2 text-sm md:text-base">{teacher.lastName}</td>
                  <td className="p-2 text-sm md:text-base">{teacher.gender}</td>
                  <td className="p-2 text-sm md:text-base">{teacher.employmentType}</td>
                  <td className="p-2 text-sm md:text-base">
                    <button 
                      onClick={() => handleEdit(teacher)} 
                      className="text-itccolor hover:text-gray-800 mr-2 text-sm md:text-base"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(teacher._id)} 
                      className="text-red-600 hover:text-red-800 text-sm md:text-base"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-2 text-center text-sm md:text-base">
                  No teachers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Buttons */}
      {filteredTeachers.length > teachersPerPage && (
        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(filteredTeachers.length / teachersPerPage) }).map(
            (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 mx-1 rounded-lg text-sm md:text-base ${
                  currentPage === index + 1 ? "bg-itccolor text-white" : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      )}

      {/* Modal for Teacher Registration */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-sm md:text-base">
              {editId ? "Edit Teacher" : "Register Teacher"}
            </h2>
            
            <form onSubmit={handleSubmit} className="mb-4">
              <div className="grid grid-cols-1 gap-4">
                {/* Only show teacher dropdown during registration, not edit */}
                {!editId && (
                  <div>
                    <label className="block text-sm md:text-base mb-1">Teacher Username</label>
                    <select 
                      name="teacherID" 
                      value={form.teacherID} 
                      onChange={handleChange} 
                      required 
                      className="w-full border p-2 rounded text-sm md:text-base"
                    >
                      <option value="">Select Teacher</option>
                      {teachersNotEnroll.map((teacher) => (
                        <option key={teacher._id} value={teacher._id}>
                          {teacher.username} 
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
                  <label className="block text-sm md:text-base mb-1">Employment Type</label>
                  <select 
                    name="employmentType" 
                    value={form.employmentType} 
                    onChange={handleChange} 
                    required 
                    className="w-full border p-2 rounded text-sm md:text-base"
                  >
                    <option value="">Select Employment Type</option>
                    <option value="fullTime">Full-Time</option>
                    <option value="partTime">Part-Time</option>
                    <option value="contract">Contract</option>
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

export default TeachersReg;