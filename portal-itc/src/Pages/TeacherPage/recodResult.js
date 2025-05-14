// import { useEffect, useState } from "react";
// import { getStudentsByClass, saveResults } from "../../services/examsRecordService";
// import { getAllClasses } from '../../../services/ClassService';

// const ResultEntry = () => {
//   const [students, setStudents] = useState([]);
//   const [classSelected, setClassSelected] = useState("");
//   const [subjectSelected, setSubjectSelected] = useState("");
//   const [scores, setScores] = useState({});
//   const [formData, setFormData] = useState({ class: "" });


//   useEffect(() => {
//     if (classSelected) {
//       getStudentsByClass(classSelected)
//         .then(setStudents)
//         .catch(() => alert("Failed to fetch students"));
//     }
//     fetchClasses();

//   }, [classSelected]);

//   const fetchClasses = async () => {
//     try {
//       const data = await getAllClasses();
//       setClasses(data);
//     } catch (error) {
//       console.error('Error fetching classes:', error);
//     }
//   };

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, class: e.target.value });
//   };


//   const handleScoreChange = (studentId, field, value) => {
//     setScores({
//       ...scores,
//       [studentId]: { ...scores[studentId], [field]: Number(value) || 0 },
//     });
//   };

//   const handleSaveResults = async () => {
//     if (!classSelected || !subjectSelected) {
//       alert("Please select a class and subject.");
//       return;
//     }
    
//     try {
//       const message = await saveResults(classSelected, subjectSelected, scores);
//       alert(message);
//     } catch {
//       alert("Error saving results");
//     }
//   };










//   return (
//     <div className="container mx-auto p-5">
//       <h2 className="text-lg font-bold">Enter Student Scores</h2>

//       <div className="mb-4">
//         {/* <select onChange={(e) => setClassSelected(e.target.value)} className="border p-2">
//           <option value="">Select Class</option>
//           <option value="JSS1">JSS1</option>
//           <option value="JSS2">JSS2</option>
//         </select> */}

// <select
//         name="class"
//         value={formData.class}
//         onChange={handleInputChange}
//         className="border p-2 mr-2"
//         required
//       >
//         <option value="" disabled>
//           Select Class
//         </option>
//         {classes.map((cl) => (
//           <option key={cl._id} value={cl._id}>
//             {cl.name}
//           </option>
//         ))}
//       </select>


//         <select onChange={(e) => setSubjectSelected(e.target.value)} className="border p-2 ml-2">
//           <option value="">Select Subject</option>
//           <option value="Mathematics">Mathematics</option>
//         </select>
//       </div>

//       <table className="w-full mt-4 border">
//         <thead>
//           <tr className="bg-gray-200">
//             <th>Name</th>
//             <th>Assignment</th>
//             <th>Test 1</th>
//             <th>Test 2</th>
//             <th>Exam</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {students.map((student) => (
//             <tr key={student._id}>
//               <td>{student.first_name} {student.last_name}</td>
//               {["assignments", "test1", "test2", "exam"].map((field) => (
//                 <td key={field}>
//                   <input
//                     type="number"
//                     className="border p-1 w-full"
//                     onChange={(e) => handleScoreChange(student._id, field, e.target.value)}
//                   />
//                 </td>
//               ))}
//               <td>
//                 <button onClick={handleSaveResults} className="bg-blue-500 text-white p-1">Save</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ResultEntry;




// import { useEffect, useState, useContext } from "react";
// import { getStudentsByClass, saveResults } from "../../services/examsRecordService";
// import { getAllClasses } from "../../services/ClassService";
// import AuthContext from '../../../context/AuthContext';
// import { getAllSubjectByTeacher} from '../../../services/SubjectService';

// const ResultEntry = () => {
//   const [students, setStudents] = useState([]);
//   const [classes, setClasses] = useState([]); // ✅ Fix: Initialize classes state
//   const [subjectSelected, setSubjectSelected] = useState("");
//   const [scores, setScores] = useState({});
//   const [formData, setFormData] = useState({ class: "" });
//   const { user } = useContext(AuthContext);

//   useEffect(() => {
//     fetchClasses();
//   }, []);

//   useEffect(() => {
//     if (formData.class) {
//       getStudentsByClass(formData.class)
//         .then(setStudents)
//         .catch(() => alert("Failed to fetch students"));
//     }
//   }, [formData.class]); // ✅ Fix: Track formData.class instead of classSelected

//   const fetchClasses = async () => {
//     try {
//       const data = await getAllClasses();
//       setClasses(data);
//     } catch (error) {
//       console.error("Error fetching classes:", error);
//     }
//   };

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, class: e.target.value });
//   };

//   const handleScoreChange = (studentId, field, value) => {
//     setScores({
//       ...scores,
//       [studentId]: { ...scores[studentId], [field]: Number(value) || 0 },
//     });
//   };

//   const handleSaveResults = async () => {
//     if (!formData.class || !subjectSelected) {
//       alert("Please select a class and subject.");
//       return;
//     }

//     try {
//       const message = await saveResults(formData.class, subjectSelected, scores);
//       alert(message);
//     } catch {
//       alert("Error saving results");
//     }
//   };

//   return (
//     <div className="container mx-auto p-5">
//       <h2 className="text-lg font-bold">Enter Student Scores</h2>

//       <div className="mb-4">
//         {/* ✅ Fix: Use formData.class and classes array */}
//         <select
//           name="class"
//           value={formData.class}
//           onChange={handleInputChange}
//           className="border p-2 mr-2"
//           required
//         >
//           <option value="" disabled>
//             Select Class
//           </option>
//           {classes.map((cl) => (
//             <option key={cl._id} value={cl.name}>
//               {cl.name}
//             </option>
//           ))}
//         </select>

//         <select onChange={(e) => setSubjectSelected(e.target.value)} className="border p-2 ml-2">
//           <option value="">Select Subject</option>
//           <option value="Mathematics">Mathematics</option>
//         </select>
//       </div>

//       <table className="w-full mt-4 border">
//         <thead>
//           <tr className="bg-gray-200">
//             <th>Name</th>
//             <th>Assignment</th>
//             <th>Test 1</th>
//             <th>Test 2</th>
//             <th>Exam</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {students.map((student) => (
//             <tr key={student._id}>
//               <td>
//                 {student.first_name} {student.last_name}
//               </td>
//               {["assignments", "test1", "test2", "exam"].map((field) => (
//                 <td key={field}>
//                   <input
//                     type="number"
//                     className="border p-1 w-full"
//                     onChange={(e) => handleScoreChange(student._id, field, e.target.value)}
//                   />
//                 </td>
//               ))}
//               <td>
//                 <button onClick={handleSaveResults} className="bg-blue-500 text-white p-1">
//                   Save
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ResultEntry;










// import { useEffect, useState, useContext } from "react";
// import { saveResults } from "../../services/examsRecordService";
// import { getAllClasses } from "../../services/ClassService";
// import {getStudentsByClass} from "../../services/studentService"
// import AuthContext from '../../context/AuthContext';
// import { getSubjectsByTeacher } from '../../services/SubjectService';

// const ResultEntry = () => {
//   const [students, setStudents] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]); // ✅ Fetch subjects dynamically
//   const [subjectSelected, setSubjectSelected] = useState("");
//   const [scores, setScores] = useState({});
//   const [formData, setFormData] = useState({ class: "" });
//   const { user } = useContext(AuthContext);
// console.log(students);
//   useEffect(() => {
//     fetchClasses();
//     fetchSubjects();
//   }, []);

//   useEffect(() => {
//     if (formData.class) {
//       getStudentsByClass(formData.class)
//         .then(setStudents)
//         .catch(() => alert("Failed to fetch students"));
//     }
//   }, [formData.class]);

//   const fetchClasses = async () => {
//     try {
//       const data = await getAllClasses();
//       setClasses(data);
//     } catch (error) {
//       console.error("Error fetching classes:", error);
//     }
//   };

//   const fetchSubjects = async () => {
//     try {
//       if (user && user._id) {
//         console.log(user._id)
//         const data = await getSubjectsByTeacher(user._id);
//         setSubjects(data);
//       }
//     } catch (error) {
//       console.error("Error fetching subjects:", error);
//     }
//   };

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, class: e.target.value });
//   };

//   const handleScoreChange = (studentId, field, value) => {
//     setScores({
//       ...scores,
//       [studentId]: { ...scores[studentId], [field]: Number(value) || 0 },
//     });
//   };

//   const handleSaveResults = async () => {
//     if (!formData.class || !subjectSelected) {
//       alert("Please select a class and subject.");
//       return;
//     }

//     try {
//       const message = await saveResults(formData.class, subjectSelected, scores);
//       alert(message);
//     } catch {
//       alert("Error saving results");
//     }
//   };

//   return (
//     <div className="container mx-auto p-5">
//       <h2 className="text-lg font-bold">Enter Student Scores</h2>

//       <div className="mb-4">
//         <select
//           name="class"
//           value={formData.class}
//           onChange={handleInputChange}
//           className="border p-2 mr-2"
//           required
//         >
//           <option value="" disabled>Select Class</option>
//           {classes.map((cl) => (
//             <option key={cl._id} value={cl._id}>
//               {cl.name}
//             </option>
//           ))}
//         </select>

//         {/* ✅ Replace hardcoded subjects with fetched subjects */}
//         <select onChange={(e) => setSubjectSelected(e.target.value)} className="border p-2 ml-2">
//           <option value="">Select Subject</option>
//           {subjects.map((subject) => (
//             <option key={subject._id} value={subject.name}>
//               {subject.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       <table className="w-full mt-4 border">
//         <thead>
//           <tr className="bg-gray-200">
//             <th>Admission No</th>
//             <th>Assignment</th>
//             <th>Test 1</th>
//             <th>Test 2</th>
//             <th>Exam</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {students.map((student) => (
//             <tr key={student._id}>
//               {/* <td>{student.firstName} {student.lastName}</td> */}
//               <td>{student.admissionNumber}</td>

//               {["assignments", "test1", "test2", "exam"].map((field) => (
//                 <td key={field}>
//                   <input
//                     type="number"
//                     className="border p-1 w-full"
//                     onChange={(e) => handleScoreChange(student._id, field, e.target.value)}
//                   />
//                 </td>
//               ))}
//               <td>
//                 <button onClick={handleSaveResults} className="bg-blue-500 text-white p-1">
//                   Save
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ResultEntry;





import { useEffect, useState, useContext } from "react";
import { saveResults, getResultsByClassAndSubject } from "../../services/examsRecordService";
// import { getAllClasses } from "../../services/ClassService";
import { getSubjectWithName } from "../../services/SubjectService";
import { getStudentsByClass } from "../../services/studentService";
import { getSubjectsByTeacher } from "../../services/SubjectService";
import AuthContext from "../../context/AuthContext";

const ResultEntry = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [terms, setTerms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectSelected, setSubjectSelected] = useState("");
  const [scores, setScores] = useState({});
  const [editableRows, setEditableRows] = useState({});
  // const [formData, setFormData] = useState({ class: "" });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // fetchClasses();
    fetchSubjects();
  }, []);

  
  useEffect(() => {
    if (subjectSelected) {
      fetchClassesFromSubject();
    }
  }, [subjectSelected]);

  useEffect(() => {
    if (classes.length > 0) {
      fetchStudentsInAClasses();
    }
  }, [classes]);

  useEffect(() => {
    if (classes.length > 0 && subjectSelected && students.length > 0) {
      fetchStudentScores();
    }
  }, [classes, subjectSelected, students]);



  const fetchClassesFromSubject = async () => {
    try {
      const data = await getSubjectWithName(subjectSelected);
      setClasses(data[0]?.class);
      console.log(data[0]?.class)
      setTerms(data[0]?.term);

    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };


  // useEffect(() => {
  //   if (classes) {
  //     getStudentsByClass(classes)
  //       .then(setStudents)
  //       .catch(() => alert("Failed to fetch students"));
  //   }
  // }, [classes]);

  const fetchStudentsInAClasses = async () => {
    try {
      const data = await getStudentsByClass(classes)
      setStudents(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };




  // useEffect(() => {
  //   if (classes && subjectSelected) {
  //     fetchStudentScores();
  //   }
  // }, [classes, subjectSelected]);

  // const fetchClasses = async () => {
  //   try {
  //     const data = await getAllClasses();
  //     setClasses(data);
  //   } catch (error) {
  //     console.error("Error fetching classes:", error);
  //   }
  // };




  const fetchSubjects = async () => {
    try {
      if (user && user._id) {
        const data = await getSubjectsByTeacher(user._id);
        setSubjects(data);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };


  const fetchStudentScores = async () => {
    try {
      const data = await getResultsByClassAndSubject(classes, subjectSelected);
  

      const scoresMap = {};
      students.forEach((student) => {
        const studentScore = data.find((s) => String(s.student_id) === String(student.studentID)) || {};        console.log(student._id, "empty")
        scoresMap[student.studentID] = {
          assignments: studentScore.assignments || 0,
          test1: studentScore.test1 || 0,
          test2: studentScore.test2 || 0,
          test3: studentScore.test3 || 0,
          exam: studentScore.exam || 0,
        };
      });

      if (students.length > 0) {
        setScores(scoresMap);
      }

    } catch (error) {
      console.error("Error fetching student scores:", error);
    }
  };

  // const handleInputChange = (e) => {
  //   setFormData({ ...formData, class: e.target.value });
  // };

  const handleScoreChange = (studentId, field, value) => {
    if (!editableRows[studentId]) return;
    setScores({
      ...scores,
      [studentId]: { ...scores[studentId], [field]: Number(value) || 0 },
    });
  };

  const toggleEdit = (studentId) => {
    setEditableRows({
      ...editableRows,
      [studentId]: !editableRows[studentId],
    });
  };

  // const handleSaveResults = async (studentId) => {
  //   try {
  //     await saveResults(formData.class, subjectSelected, scores[studentId], user._id);
  //     alert("Results saved successfully");
  //     toggleEdit(studentId);
  //   } catch (error) {
  //     alert("Error saving results");
  //   }
  // };

  const handleSaveResults = async (studentId) => {
    console.log(studentId, terms, 'crazy stuff')
    try {
      const studentScore = scores[studentId];
  
      const payload = {
        classSelected: classes,
        subject: subjectSelected,
        teacher_id: user._id,
        term_id : terms,
        scores: {
          [studentId]: {
            assignments: studentScore.assignments || 0,
            test1: studentScore.test1 || 0,
            test2: studentScore.test2 || 0,
            test3: studentScore.test3 || 0, // Include test3 if applicable
            exam: studentScore.exam || 0,
          },
        },
        
      };
  
      await saveResults(payload);
      alert("Results saved successfully");
      toggleEdit(studentId);
    } catch (error) {
      alert("Error saving results");
    }
  };

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-lg font-bold">Enter Student Scores</h2>

      <div className="mb-4">
        {/* <select name="class" value={formData.class} onChange={handleInputChange} className="border p-2 mr-2" required>
          <option value="" disabled>Select Class</option>
          {classes.map((cl) => (
            <option key={cl._id} value={cl._id}>{cl.name}</option>
          ))}
        </select> */}

        <select onChange={(e) => setSubjectSelected(e.target.value)} className="border p-2 ml-2">
          <option value="">Select Subject</option>
          {subjects.map((subject) => (
            <option key={subject._id} value={subject.name}>{subject.name}</option>
          ))}
        </select>
      </div>

      <table className="w-full mt-4 border">
        <thead>
          <tr className="bg-gray-200">
            <th>Admission No</th>
            <th>Assignment</th>
            <th>Test 1</th>
            <th>Test 2</th>
            <th>Test 3</th>
            <th>Exam</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.studentID}>
              <td>{student.admissionNumber}</td>
              {["assignments", "test1", "test2", "test3", "exam"].map((field) => (
                <td key={field}>
                  <input
                    type="number"
                    className="border p-1 w-full"
                    value={scores[student.studentID]?.[field] || 0}
                    onChange={(e) => handleScoreChange(student.studentID, field, e.target.value)}
                    disabled={!editableRows[student.studentID]}
                  />
                </td>
              ))}
              <td>
                {editableRows[student.studentID] ? (
                  <button onClick={() => handleSaveResults(student.studentID)} className="bg-green-500 text-white p-1">
                    Save
                  </button>
                ) : (
                  <button onClick={() => toggleEdit(student.studentID)} className="bg-blue-500 text-white p-1">
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultEntry;