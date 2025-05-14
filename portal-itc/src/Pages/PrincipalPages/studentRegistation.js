// import React, { useEffect, useState } from "react";
// import { createStudent, getAllStudents, updateStudent, deleteStudent } from "../../services/studentService";

// const StudentsReg = () => {
//   const [students, setStudents] = useState([]);
//   const [form, setForm] = useState({ name: "", age: "", gender: "", class: "" });
//   const [editId, setEditId] = useState(null);

//   // Fetch students on mount
//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const fetchStudents = async () => {
//     try {
//       const response = await getAllStudents();
//       setStudents(response.data);
//     } catch (error) {
//       console.error("Error fetching students:", error);
//     }
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editId) {
//         await updateStudent(editId, form);
//         setEditId(null);
//       } else {
//         await createStudent(form);
//       }
//       setForm({ name: "", age: "", gender: "", class: "" });
//       fetchStudents();
//     } catch (error) {
//       console.error("Error submitting form:", error);
//     }
//   };

//   const handleEdit = (student) => {
//     setForm(student);
//     setEditId(student._id);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this student?")) {
//       try {
//         await deleteStudent(id);
//         fetchStudents();
//       } catch (error) {
//         console.error("Error deleting student:", error);
//       }
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Student Registration</h1>
//       {/* Student Form */}
//       <form onSubmit={handleSubmit} className="mb-4">
//         <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="border p-2 m-2" />
//         <input type="number" name="age" value={form.age} onChange={handleChange} placeholder="Age" required className="border p-2 m-2" />
//         <select name="gender" value={form.gender} onChange={handleChange} required className="border p-2 m-2">
//           <option value="">Select Gender</option>
//           <option value="Male">Male</option>
//           <option value="Female">Female</option>
//         </select>
//         <input type="text" name="class" value={form.class} onChange={handleChange} placeholder="Class (e.g. JSS1)" required className="border p-2 m-2" />
//         <button type="submit" className="bg-blue-500 text-white p-2">{editId ? "Update" : "Register"}</button>
//       </form>

//       {/* Students List */}
//       <table className="w-full border-collapse border">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-2">Name</th>
//             <th className="border p-2">Age</th>
//             <th className="border p-2">Gender</th>
//             <th className="border p-2">Class</th>
//             <th className="border p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {students.map((student) => (
//             <tr key={student._id} className="border">
//               <td className="border p-2">{student.name}</td>
//               <td className="border p-2">{student.age}</td>
//               <td className="border p-2">{student.gender}</td>
//               <td className="border p-2">{student.class}</td>
//               <td className="border p-2">
//                 <button onClick={() => handleEdit(student)} className="bg-yellow-500 text-white p-1 m-1">Edit</button>
//                 <button onClick={() => handleDelete(student._id)} className="bg-red-500 text-white p-1 m-1">Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default StudentsReg;




// import React, { useEffect, useState, useContext} from "react";
// import { createStudent, getAllStudents, updateStudent, deleteStudent } from "../../services/studentService";
// import {getAllClasses} from "../../services/ClassService";
// import {getAllSessions} from "../../services/SessionService";
// import AuthContext from '../../context/AuthContext';
// import {updateEnroll, getAllUsersNotEnroll,  } from "../../services/userService" 

// const StudentsReg = () => {
//   const { user } = useContext(AuthContext);
//   const [students, setStudents] = useState([]);
//   const [studentsNotEnroll, setUserNotEnroll] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [sessions, setSessions] = useState([]);
//   const [editId, setEditId] = useState(null);
// const [Error, setMessage] = useState([])
//   const [form, setForm] = useState({
//     studentID: "",
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
//     admissionNumber: "",
//     class: "",
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
//     fetchStudents();
//     fetchClasses();
//     fetchSessions();
//     fetchUsers()
//   }, []);

//   const fetchStudents = async () => {
//     try {
//       const response = await getAllStudents();
//       console.log(response, "fectehd student");
//       setStudents(response?.data || []); // Chaining to prevent errors if no data
//     } catch (error) {
//       console.error("Error fetching students:", error);
//       setStudents([]); // Ensure state is always an array
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const response = await getAllUsersNotEnroll(user.token);
//       console.log(response, "fetched users");
  
//       // Ensure `students` array is properly extracted
//       setUserNotEnroll(response?.data?.students || []);  
//     } catch (error) {
//       console.error("Error fetching students:", error);
//       setUserNotEnroll([]); // Ensure state is always an array
//     }
//   };

//   const handleUpdateEnroll = async (userId) => {
//     try {
//       const response = await updateEnroll(userId);
//       setMessage(response.message);
//     } catch (error) {
//       setMessage(error.response?.data?.message || 'Error updating enroll');
//     }
//   };

//   const fetchClasses = async () => {
//     try {
//       const response = await getAllClasses();
//       console.log(response, "fectehd class");

//       setClasses(response || []); // Handle empty response
//     } catch (error) {
//       console.error("Error fetching classes:", error);
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
//         await updateStudent(editId, form);
//         setEditId(null);
//       } else {
//         await createStudent(form);
//       }
//       const selectedUserId = form.studentID; // Get the selected 
//       setForm({
//         studentID: "",
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
//         admissionNumber: "",
//         class: "",
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

//       fetchStudents();
//       fetchUsers(); // Refresh users without enrollment
//     } catch (error) {
//       console.error("Error submitting form:", error);
//     }
//   };

//   const handleEdit = (student) => {
//     setForm(student);
//     setEditId(student._id);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this student?")) {
//       try {
//         await deleteStudent(id);
//         fetchStudents();
//       } catch (error) {
//         console.error("Error deleting student:", error);
//       }
//     }
//   };


// return (
//   <div className="container mx-auto p-4">
//     <h1 className="text-2xl font-bold mb-4">Student Registration</h1>

//     {/* Student Form */}
//     <form onSubmit={handleSubmit} className="mb-4 grid grid-cols-2 gap-4">
//       <select name="studentID" value={form.studentID} onChange={handleChange} required className="border p-2">
//         <option value="">Select Student</option>
//         {studentsNotEnroll.map((student) => (
//           <option key={student._id} value={student._id}>
//             {student.username} 
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
//       <input type="text" name="admissionNumber" value={form.admissionNumber} onChange={handleChange} placeholder="Admission Number" required className="border p-2" />
//       <select name="class" value={form.class} onChange={handleChange} required className="border p-2">
//         <option value="">Select Class</option>
//         {classes.map((cls) => (
//           <option key={cls._id} value={cls._id}>
//             {cls.name}
//           </option>
//         ))}
//       </select>
//       <select name="session" value={form.session} onChange={handleChange} required className="border p-2">
//         <option value="">Select Session</option>
//         {sessions.map((sess) => (
//           <option key={sess._id} value={sess._id}>
//             {sess.name}
//           </option>
//         ))}
//       </select>
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
//       {/* <tbody>
//         {students.map((student) => (
//           <tr key={student._id} className="border">
//             <td className="border p-2">{student.firstName}</td>
//             <td className="border p-2">{student.lastName}</td>
//             <td className="border p-2">{student.gender}</td>
//             <td className="border p-2">{student.class}</td>
//             <td className="border p-2">{student.session}</td>
//             <td className="border p-2">
//               <button onClick={() => handleEdit(student)} className="bg-yellow-500 text-white p-1 m-1">Edit</button>
//               <button onClick={() => handleDelete(student._id)} className="bg-red-500 text-white p-1 m-1">Delete</button>
//             </td>
//           </tr>
//         ))}
//       </tbody> */}


// <tbody>
//           {/* {students.map((student) => (
// //             <tr key={student._id} className="border">
// //               <td className="border p-2">{student.firstName} {student.lastName}</td>
// //               <td className="border p-2">{student.gender}</td>
// //               <td className="border p-2">{student.class}</td>
// //               <td className="border p-2">{student.session}</td>
// //               <td className="border p-2">
// //                 <button onClick={() => handleEdit(student)} className="bg-yellow-500 text-white p-1 m-1">Edit</button>
// //                 <button onClick={() => handleDelete(student._id)} className="bg-red-500 text-white p-1 m-1">Delete</button>
// //               </td>
// //             </tr>
// //           ))} */}

//  {Array.isArray(students) && students.length > 0 ? (
//    students.map((student) => (
//      <tr key={student._id} className="border">
//        <td className="border p-2">{student.firstName} {student.lastName}</td>
//        <td className="border p-2">{student.gender}</td>
//        <td className="border p-2">{student.phoneNumber}</td>
//        <td className="border p-2">{student.admissionNumber}</td>
//        <td className="border p-2">
//          <button onClick={() => handleEdit(student)} className="bg-yellow-500 text-white p-1 m-1">Edit</button>
//          <button onClick={() => handleDelete(student._id)} className="bg-red-500 text-white p-1 m-1">Delete</button>
//        </td>
//      </tr>
//    ))
//  ) : (
//    <tr>
//      <td colSpan="5" className="text-center p-4 text-gray-500">
//        No students found
//      </td>
//    </tr>
//  )}
//          </tbody>
//     </table>
//   </div>
// );
// };

// export default StudentsReg;




import React, { useEffect, useState, useContext } from "react";
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
  const [currentStep, setCurrentStep] = useState(1);
  
  const [form, setForm] = useState({
    studentID: "",
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
    admissionNumber: "",
    class: "",
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
      dateOfBirth: "",
      nationality: "Nigerian",
      stateOfOrigin: "",
      lgaOfOrigin: "",
      address: "",
      phoneNumber: "",
      email: "",
      admissionNumber: "",
      class: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuardianChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      guardian: { ...prev.guardian, [name]: value }
    }));
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [name]: value }
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
      setError("Failed to fetch unenrolled students");
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
      if (editId) {
        await updateStudent(editId, form);
      } else {
        await createStudent(form);
      }
      fetchStudents();
      fetchUsers();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.response?.data?.message || "Failed to save student");
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
      <h1 className="text-2xl font-bold mb-4">Student Registration</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
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
          className="border p-2 w-full md:w-1/3 rounded"
        />
        <select
          value={selectedClass}
          onChange={handleClassFilter}
          className="border p-2 w-full md:w-1/3 rounded"
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
          className="bg-itccolor text-white px-4 py-2 rounded w-full md:w-auto hover:bg-red-600 transition"
        >
          Register Student
        </button>
      </div>

      {/* Student Count */}
      <div className="bg-gray-200 p-4 rounded mb-4">
        <h2 className="text-lg font-bold">Total Students: {students.length}</h2>
      </div>

      {/* Student List */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">First Name</th>
              <th className="border p-2">Last Name</th>
              <th className="border p-2">Admission Number</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.length > 0 ? (
              currentStudents.map((student) => (
                <tr key={student._id}>
                  <td className="border p-2">{student.firstName}</td>
                  <td className="border p-2">{student.lastName}</td>
                  <td className="border p-2">{student.admissionNumber}</td>
                  <td className="border p-2">
                    <button 
                      onClick={() => handleEdit(student)} 
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(student._id)} 
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="border p-2 text-center">
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
              className={`px-4 py-2 mx-1 rounded ${currentPage === index + 1 ? "bg-itccolor  text-white" : "bg-gray-300 hover:bg-gray-400"}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editId ? "Edit Student" : "Register Student"}
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
                      name="studentID" 
                      value={form.studentID} 
                      onChange={handleChange} 
                      required 
                      className="w-full border p-2 rounded"
                    >
                      <option value="">Select Student</option>
                      {studentsNotEnroll.map((student) => (
                        <option key={student._id} value={student._id}>
                          {student.username} 
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

              {/* Step 2: Academic Details */}
              {currentStep === 2 && (
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
                    name="admissionNumber" 
                    value={form.admissionNumber} 
                    onChange={handleChange} 
                    placeholder="Admission Number" 
                    required 
                    className="border p-2 rounded" 
                  />
                  <select 
                    name="class" 
                    value={form.class} 
                    onChange={handleChange} 
                    required 
                    className="border p-2 rounded"
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
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
                </div>
              )}

              {/* Step 3: Guardian & Emergency Contact */}
              {currentStep === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <h3 className="text-lg font-semibold md:col-span-2">
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
                    className="bg-itccolor text-white px-4 py-2 rounded hover:bg-red-600 transition"
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

export default StudentsReg;