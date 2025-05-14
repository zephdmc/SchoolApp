
// import React, { useEffect, useState, useContext} from "react";
// import { createTeacher, getAllTeachers, updateTeacher, deleteTeacher } from "../../services/teacherService";
// import {getAllSessions} from "../../services/SessionService";
// import AuthContext from '../../context/AuthContext';
// import {updateEnrollTeacher, getAllTeachersUsersNotEnroll,  } from "../../services/userService" 

// const TeachersReg = () => {
//   const { user } = useContext(AuthContext);
//   const [teachers, setStudents] = useState([]);
//   const [teachersNotEnroll, setUserNotEnroll] = useState([]);
//   const [sessions, setSessions] = useState([]);
//   const [editId, setEditId] = useState(null);
// const [Error, setMessage] = useState([])
//   const [form, setForm] = useState({
//     teacherID: "",
//     firstName: "",
//     lastName: "",
//     middleName: "",
//     gender: "",
//     dateOfBirth: "",
//     nationality: "Nigerian",
//     stateOfOrigin: "",
//     lgaOfOrigin: "",
//     address: "",
//     phoneNumber: "",
//     email: "",
//     staffNumber: "",
//     higherQualification: "",
//     employmentType: "",
//     bankname: "",
//     accountNumber: "",
//     NIN: "",
//     section: "",
//     guardian: { fullName: "", relationship: "", phoneNumber: "", address: "" },
//     admissionDate: "",
//     passportPhoto: "",
//     bloodGroup: "",
//     genotype: "",
//     emergencyContact: { name: "", phone: "", relationship: "" },
//     status: "Active",
//     session: "" // New session field
//   });

//   // Fetch students, classes, and sessions on mount
//   useEffect(() => {
//     fetchTeachers();
//     fetchSessions();
//     fetchUsers()
//   }, []);

//   const fetchTeachers= async () => {
//     try {
//       const response = await getAllTeachers();
//       console.log(response, "fectehd Teachers");
//       setStudents(response?.data || []); // Chaining to prevent errors if no data
//     } catch (error) {
//       console.error("Error fetching Teachers:", error);
//       setStudents([]); // Ensure state is always an array
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const response = await getAllTeachersUsersNotEnroll(user.token);
//       console.log(response, "fetched  teacher users");
  
//       // Ensure `Teachers` array is properly extracted
//       // setUserNotEnroll(response?.data?.techers || []);  
//       setUserNotEnroll(response || []);  

//     } catch (error) {
//       console.error("Error fetching students:", error);
//       setUserNotEnroll([]); // Ensure state is always an array
//     }
//   };

//   const handleUpdateEnroll = async (userId) => {
//     try {
//       const response = await updateEnrollTeacher(userId);
//       setMessage(response.message);
//     } catch (error) {
//       setMessage(error.response?.data?.message || 'Error updating enroll');
//     }
//   };



//   const fetchSessions = async () => {
//     try {
//       const response = await getAllSessions();
//       console.log(response, "fectehd session");
//       setSessions(response|| []); // Handle empty response
//     } catch (error) {
//       console.error("Error fetching sessions:", error);
//     }
//   };

//   //  const fetchSessions = async () => {
//   //     const data = await getAllSessions();
//   //     setSessions(data);
//   //   };


//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleGuardianChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       guardian: { ...prev.guardian, [name]: value }
//     }));
//   };

//   const handleEmergencyContactChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       emergencyContact: { ...prev.emergencyContact, [name]: value }
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editId) {
//         await updateTeacher(editId, form);
//         setEditId(null);
//       } else {
//         await createTeacher(form);
//       }
//       const selectedUserId = form.studentID; // Get the selected 
//       setForm({
//         teacherID: "",
//         firstName: "",
//         lastName: "",
//         middleName: "",
//         gender: "",
//         dateOfBirth: "",
//         nationality: "Nigerian",
//         stateOfOrigin: "",
//         lgaOfOrigin: "",
//         address: "",
//         phoneNumber: "",
//         email: "",
//         staffNumber: "",
//         higherQualification: "",
//         employmentType: "",
//         bankname: "",
//         accountNumber: "",
//         NIN: "",
//         section: "",
//         guardian: { fullName: "", relationship: "", phoneNumber: "", address: "" },
//         admissionDate: "",
//         passportPhoto: "",
//         bloodGroup: "",
//         genotype: "",
//         emergencyContact: { name: "", phone: "", relationship: "" },
//         status: "Active",
//         session: ""
//       });
//  // Trigger updateEnroll with the selected user ID
//  if (selectedUserId) {
//   await handleUpdateEnroll(selectedUserId);
// }

//       fetchTeachers();
//       fetchUsers(); // Refresh users without enrollment
//     } catch (error) {
//       console.error("Error submitting form:", error);
//     }
//   };

//   const handleEdit = (teacher) => {
//     setForm(teacher);
//     setEditId(teacher._id);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this Teacher?")) {
//       try {
//         await deleteTeacher(id);
//         fetchTeachers();
//       } catch (error) {
//         console.error("Error deleting teacher:", error);
//       }
//     }
//   };


// return (
//   <div className="container mx-auto p-4">
//     <h1 className="text-2xl font-bold mb-4">Teacher Registration</h1>

//     {/* Student Form */}
//     <form onSubmit={handleSubmit} className="mb-4 grid grid-cols-2 gap-4">
//       <select name="teacherID" value={form.teacherID} onChange={handleChange} required className="border p-2">
//         <option value="">Select Teacher</option>
//         {teachersNotEnroll.map((teacher) => (
//           <option key={teacher._id} value={teacher._id}>
//             {teacher.username} 
//           </option>
//         ))}
//       </select>
//       <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" required className="border p-2" />
//       <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" required className="border p-2" />
//       <input type="text" name="middleName" value={form.middleName} onChange={handleChange} placeholder="Middle Name" className="border p-2" />
//       <select name="gender" value={form.gender} onChange={handleChange} required className="border p-2">
//         <option value="">Select Gender</option>
//         <option value="Male">Male</option>
//         <option value="Female">Female</option>
//       </select>
//       <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} required className="border p-2" />
//       <input type="text" name="stateOfOrigin" value={form.stateOfOrigin} onChange={handleChange} placeholder="State of Origin" required className="border p-2" />
//       <input type="text" name="lgaOfOrigin" value={form.lgaOfOrigin} onChange={handleChange} placeholder="LGA of Origin" required className="border p-2" />
//       <input type="text" name="section" value={form.section} onChange={handleChange} placeholder="Section" required className="border p-2" />
//       <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Phone Number" required className="border p-2" />
//       <input type="text" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2" />
//       <input type="text" name="staffNumber" value={form.staffNumber} onChange={handleChange} placeholder="Admission Number" required className="border p-2" />
//       <input type="text" name="higherQualification" value={form.higherQualification} onChange={handleChange} placeholder="Higher Qualification" required className="border p-2" />
//       <select name="employmentType" value={form.employmentType} onChange={handleChange} required className="border p-2">
//         <option value="">Employment Type</option>
//         <option value="fullTime">Full-Time</option>
//         <option value="partTime">Part-Time</option>
//         <option value="contract">Contract</option>

//       </select>
//       <input type="text" name="" value={form.employmentType} onChange={handleChange} placeholder="Employment Type " required className="border p-2" />
//       <input type="text" name="bankname" value={form.bankname} onChange={handleChange} placeholder="Bank Name" required className="border p-2" />
//       <input type="number" name="accountNumber" value={form.accountNumber} onChange={handleChange} placeholder="Account Number" required className="border p-2" />
//       <input type="number" name="NIN" value={form.NIN} onChange={handleChange} placeholder="NIN Number" required className="border p-2" />


// {/* Dropdown for Session */}
//         <select name="session" value={form.session} onChange={handleChange} required className="border p-2">
//           <option value="">Select Session</option>
//         {sessions.map((session) => (
//             <option key={session._id} value={session._id}>{session.name}</option>
//           ))}
//         </select>
//       <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Address" required className="border p-2" />
//       <input type="text" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} placeholder="Blood Group" className="border p-2" />
//       <input type="text" name="genotype" value={form.genotype} onChange={handleChange} placeholder="Genotype" className="border p-2" />

//       {/* Guardian Details */}
//       <h2 className="text-xl font-bold col-span-2">Guardian Information</h2>
//       <input type="text" name="fullName" value={form.guardian.fullName} onChange={handleGuardianChange} placeholder="Guardian's Full Name" required className="border p-2" />
//       <input type="text" name="relationship" value={form.guardian.relationship} onChange={handleGuardianChange} placeholder="Relationship" required className="border p-2" />
//       <input type="text" name="phoneNumber" value={form.guardian.phoneNumber} onChange={handleGuardianChange} placeholder="Guardian's Phone Number" required className="border p-2" />
//       <input type="text" name="address" value={form.guardian.address} onChange={handleGuardianChange} placeholder="Guardian's Address" required className="border p-2" />

//       {/* Emergency Contact */}
//       <h2 className="text-xl font-bold col-span-2">Emergency Contact</h2>
//       <input type="text" name="name" value={form.emergencyContact.name} onChange={handleEmergencyContactChange} placeholder="Emergency Contact Name" required className="border p-2" />
//       <input type="text" name="phone" value={form.emergencyContact.phone} onChange={handleEmergencyContactChange} placeholder="Emergency Contact Phone" required className="border p-2" />
//       <input type="text" name="relationship" value={form.emergencyContact.relationship} onChange={handleEmergencyContactChange} placeholder="Relationship" required className="border p-2" />

//       <button type="submit" className="bg-blue-500 text-white p-2 col-span-2">{editId ? "Update" : "Register"}</button>
//     </form>

//     {/* Students List */}
//     <table className="w-full border-collapse border mt-4">
//       <thead>
//         <tr className="bg-gray-200">
//           <th className="border p-2">Name</th>
//           <th className="border p-2">Gender</th>
//           <th className="border p-2">Phone</th>
//           <th className="border p-2">Admission Numer</th>
//           <th className="border p-2">Actions</th>
//         </tr>
//       </thead>
   


// <tbody>
         
//  {Array.isArray(teachers) && teachers.length > 0 ? (
//    teachers.map((teacher) => (
//      <tr key={teacher._id} className="border">
//        <td className="border p-2">{teacher.firstName} {teacher.lastName}</td>
//        <td className="border p-2">{teacher.gender}</td>
//        <td className="border p-2">{teacher.phoneNumber}</td>
//        <td className="border p-2">{teacher.staffNumber}</td>
//        <td className="border p-2">
//          <button onClick={() => handleEdit(teacher)} className="bg-yellow-500 text-white p-1 m-1">Edit</button>
//          <button onClick={() => handleDelete(teacher._id)} className="bg-red-500 text-white p-1 m-1">Delete</button>
//        </td>
//      </tr>
//    ))
//  ) : (
//    <tr>
//      <td colSpan="5" className="text-center p-4 text-gray-500">
//        No Teachers found
//      </td>
//    </tr>
//  )}
//          </tbody>
//     </table>
//   </div>
// );
// };

// export default TeachersReg;










import React, { useEffect, useState, useContext } from "react";
import {
  createTeacher,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
} from "../../services/teacherService";
import { getAllSessions } from "../../services/SessionService";
import AuthContext from "../../context/AuthContext";
import {
  updateEnrollTeacher,
  getAllTeachersUsersNotEnroll,
} from "../../services/userService";
import { FaUserCircle } from "react-icons/fa";

const TeachersReg = () => {
  const { user } = useContext(AuthContext);
  const [teachers, setTeachers] = useState([]);
  const [teachersNotEnroll, setUserNotEnroll] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 20;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [form, setForm] = useState({
    teacherID: "",
    firstName: "",
    lastName: "",
    middleName: "",
    gender: "",
    dateOfBirth: "",
    nationality: "Nigerian",
    stateOfOrigin: "",
    lgaOfOrigin: "",
    address: "",
    phoneNumber: "",
    email: "",
    staffNumber: "",
    higherQualification: "",
    employmentType: "",
    bankname: "",
    accountNumber: "",
    NIN: "",
    section: "",
    guardian: { 
      fullName: "", 
      relationship: "", 
      phoneNumber: "", 
      address: "" 
    },
    admissionDate: "",
    passportPhoto: "",
    bloodGroup: "",
    genotype: "",
    emergencyContact: { 
      name: "", 
      phone: "", 
      relationship: "" 
    },
    status: "Active",
    session: ""
  });

  useEffect(() => {
    fetchTeachers();
    fetchSessions();
    fetchUsers();
  }, []);

  const resetForm = () => {
    setForm({
      teacherID: "",
      firstName: "",
      lastName: "",
      middleName: "",
      gender: "",
      dateOfBirth: "",
      nationality: "Nigerian",
      stateOfOrigin: "",
      lgaOfOrigin: "",
      address: "",
      phoneNumber: "",
      email: "",
      staffNumber: "",
      higherQualification: "",
      employmentType: "",
      bankname: "",
      accountNumber: "",
      NIN: "",
      section: "",
      guardian: { fullName: "", relationship: "", phoneNumber: "", address: "" },
      admissionDate: "",
      passportPhoto: "",
      bloodGroup: "",
      genotype: "",
      emergencyContact: { name: "", phone: "", relationship: "" },
      status: "Active",
      session: ""
    });
    setCurrentStep(1);
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

  const fetchSessions = async () => {
    try {
      const response = await getAllSessions();
      setSessions(response || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setError("Failed to fetch sessions");
    }
  };

  const handleUpdateEnroll = async (userId) => {
    try {
      const response = await updateEnrollTeacher(userId);
      setError(response.message);
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating enroll');
    }
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [name]: value }
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardianChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      guardian: { ...prev.guardian, [name]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateTeacher(editId, form);
      } else {
        await createTeacher(form);
      }
      fetchTeachers();
      fetchUsers();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.response?.data?.message || "Failed to save teacher");
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
    [teacher.firstName, teacher.lastName, teacher.staffNumber]
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
          placeholder="Search by First Name, Last Name, or Staff Number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 w-full md:w-1/3 rounded-lg"
        />
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-itccolor text-white px-4 py-2 rounded-lg w-full md:w-auto hover:bg-red-800 transition"
        >
          Register Teacher
        </button>
      </div>

      {/* Teachers List */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">First Name</th>
              <th className="border p-2">Last Name</th>
              <th className="border p-2">Staff Number</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTeachers.length > 0 ? (
              paginatedTeachers.map((teacher) => (
                <tr key={teacher._id} className="border hover:bg-gray-50">
                  <td className="p-2">{teacher.firstName}</td>
                  <td className="p-2">{teacher.lastName}</td>
                  <td className="p-2">{teacher.staffNumber}</td>
                  <td className="p-2">
                    <button 
                      onClick={() => handleEdit(teacher)} 
                      className="text-itccolor hover:text-gray-800 mr-2"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(teacher._id)} 
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-2 text-center">
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
                className={`px-3 py-1 mx-1 rounded-lg ${
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editId ? "Edit Teacher" : "Register Teacher"}
            </h2>
            
            {/* Step Indicator */}
            <div className="flex justify-center mb-6">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div 
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      currentStep >= step ? 'bg-itccolor text-white' : 'bg-gray-200'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div 
                      className={`w-16 h-1 mt-3 ${
                        currentStep > step ? 'bg-itccolor' : 'bg-gray-200'
                      }`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mb-4">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <select 
                      name="teacherID" 
                      value={form.teacherID} 
                      onChange={handleChange} 
                      required 
                      className="w-full border p-2 rounded"
                    >
                      <option value="">Select Teacher</option>
                      {teachersNotEnroll.map((teacher) => (
                        <option key={teacher._id} value={teacher._id}>
                          {teacher.username} 
                        </option>
                      ))}
                    </select>
                  </div>
                  <input 
                    type="text" 
                    name="firstName" 
                    value={form.firstName} 
                    onChange={handleChange} 
                    placeholder="First Name" 
                    required 
                    className="border p-2 rounded" 
                  />
                  <input 
                    type="text" 
                    name="lastName" 
                    value={form.lastName} 
                    onChange={handleChange} 
                    placeholder="Last Name" 
                    required 
                    className="border p-2 rounded" 
                  />
                  <input 
                    type="text" 
                    name="middleName" 
                    value={form.middleName} 
                    onChange={handleChange} 
                    placeholder="Middle Name" 
                    className="border p-2 rounded" 
                  />
                  <select 
                    name="gender" 
                    value={form.gender} 
                    onChange={handleChange} 
                    required 
                    className="border p-2 rounded"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <input 
                    type="date" 
                    name="dateOfBirth" 
                    value={form.dateOfBirth} 
                    onChange={handleChange} 
                    required 
                    className="border p-2 rounded" 
                  />
                  <input 
                    type="text" 
                    name="stateOfOrigin" 
                    value={form.stateOfOrigin} 
                    onChange={handleChange} 
                    placeholder="State of Origin" 
                    required 
                    className="border p-2 rounded" 
                  />
                  <input 
                    type="text" 
                    name="lgaOfOrigin" 
                    value={form.lgaOfOrigin} 
                    onChange={handleChange} 
                    placeholder="LGA of Origin" 
                    required 
                    className="border p-2 rounded" 
                  />
                  <input 
                    type="text" 
                    name="section" 
                    value={form.section} 
                    onChange={handleChange} 
                    placeholder="Section" 
                    required 
                    className="border p-2 rounded" 
                  />
                </div>
              )}

              {/* Step 2: Professional Details */}
              {currentStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    name="staffNumber" 
                    value={form.staffNumber} 
                    onChange={handleChange} 
                    placeholder="Staff Number" 
                    required 
                    className="border p-2 rounded" 
                  />
                  <input 
                    type="text" 
                    name="higherQualification" 
                    value={form.higherQualification} 
                    onChange={handleChange} 
                    placeholder="Highest Qualification" 
                    required 
                    className="border p-2 rounded" 
                  />
                  <select 
                    name="employmentType" 
                    value={form.employmentType} 
                    onChange={handleChange} 
                    required 
                    className="border p-2 rounded"
                  >
                    <option value="">Select Employment Type</option>
                    <option value="fullTime">Full-Time</option>
                    <option value="partTime">Part-Time</option>
                    <option value="contract">Contract</option>
                  </select>
                  <input 
                    type="text" 
                    name="bankname" 
                    value={form.bankname} 
                    onChange={handleChange} 
                    placeholder="Bank Name" 
                    required 
                    className="border p-2 rounded" 
                  />
                  <input 
                    type="text" 
                    name="accountNumber" 
                    value={form.accountNumber} 
                    onChange={handleChange} 
                    placeholder="Account Number" 
                    required 
                    className="border p-2 rounded" 
                  />
                  <input 
                    type="text" 
                    name="NIN" 
                    value={form.NIN} 
                    onChange={handleChange} 
                    placeholder="NIN Number" 
                    className="border p-2 rounded" 
                  />
                  <select 
                    name="session" 
                    value={form.session} 
                    onChange={handleChange} 
                    required 
                    className="border p-2 rounded"
                  >
                    <option value="">Select Session</option>
                    {sessions.map((session) => (
                      <option key={session._id} value={session._id}>
                        {session.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Step 3: Contact & Emergency Info */}
              {currentStep === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    name="phoneNumber" 
                    value={form.phoneNumber} 
                    onChange={handleChange} 
                    placeholder="Phone Number" 
                    required 
                    className="border p-2 rounded" 
                  />
                  <input 
                    type="text" 
                    name="email" 
                    value={form.email} 
                    onChange={handleChange} 
                    placeholder="Email" 
                    className="border p-2 rounded" 
                  />
                  <input 
                    type="text" 
                    name="address" 
                    value={form.address} 
                    onChange={handleChange} 
                    placeholder="Address" 
                    required 
                    className="border p-2 rounded" 
                  />
                  <input 
                    type="text" 
                    name="bloodGroup" 
                    value={form.bloodGroup} 
                    onChange={handleChange} 
                    placeholder="Blood Group" 
                    className="border p-2 rounded" 
                  />
                  <input 
                    type="text" 
                    name="genotype" 
                    value={form.genotype} 
                    onChange={handleChange} 
                    placeholder="Genotype" 
                    className="border p-2 rounded" 
                  />

                  <h3 className="text-lg font-semibold md:col-span-2 mt-4">
                    Guardian Information
                  </h3>
                  <input 
                    type="text" 
                    name="fullName" 
                    value={form.guardian.fullName} 
                    onChange={handleGuardianChange} 
                    placeholder="Guardian's Full Name" 
                    required 
                    className="border p-2 rounded" 
                  />
                  <input 
                    type="text" 
                    name="relationship" 
                    value={form.guardian.relationship} 
                    onChange={handleGuardianChange} 
                    placeholder="Relationship" 
                    required 
                    className="border p-2 rounded" 
                  />
                  <input 
                    type="text" 
                    name="phoneNumber" 
                    value={form.guardian.phoneNumber} 
                    onChange={handleGuardianChange} 
                    placeholder="Guardian's Phone Number" 
                    required 
                    className="border p-2 rounded" 
                  />
                  <input 
                    type="text" 
                    name="address" 
                    value={form.guardian.address} 
                    onChange={handleGuardianChange} 
                    placeholder="Guardian's Address" 
                    required 
                    className="border p-2 rounded" 
                  />

                  <h3 className="text-lg font-semibold md:col-span-2 mt-4">
                    Emergency Contact
                  </h3>
                  <input 
                    type="text" 
                    name="name" 
                    value={form.emergencyContact.name} 
                    onChange={handleEmergencyContactChange} 
                    placeholder="Emergency Contact Name" 
                    required 
                    className="border p-2 rounded" 
                  />
                  <input 
                    type="text" 
                    name="phone" 
                    value={form.emergencyContact.phone} 
                    onChange={handleEmergencyContactChange} 
                    placeholder="Emergency Contact Phone" 
                    required 
                    className="border p-2 rounded" 
                  />
                  <input 
                    type="text" 
                    name="relationship" 
                    value={form.emergencyContact.relationship} 
                    onChange={handleEmergencyContactChange} 
                    placeholder="Relationship" 
                    required 
                    className="border p-2 rounded" 
                  />
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                {currentStep > 1 ? (
                  <button 
                    type="button" 
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                  >
                    Previous
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < 3 ? (
                  <button 
                    type="button" 
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="bg-itccolor text-white px-4 py-2 rounded hover:bg-red-800 transition"
                  >
                    Next
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                  >
                    {editId ? "Update" : "Register"}
                  </button>
                )}
              </div>

              <div className="flex justify-end mt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }} 
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Close
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