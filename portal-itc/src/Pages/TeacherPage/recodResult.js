import { useEffect, useState, useContext } from "react";
import { saveResults, getResultsByClassAndSubject } from "../../services/examsRecordService";
import { getSubjectWithName } from "../../services/SubjectService";
import { getStudentsByClass } from "../../services/studentService";
import { getSubjectsByTeacher } from "../../services/SubjectService";
import AuthContext from "../../context/AuthContext";
import { FiEdit, FiSave, FiUser } from "react-icons/fi";
import { getClassById } from "../../services/ClassService";
import { getAllTerms } from "../../services/termService";

const ResultEntry = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [terms, setTerms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectSelected, setSubjectSelected] = useState("");
  const [scores, setScores] = useState({});
  const [editableRows, setEditableRows] = useState({});
  const [className, setClassName] = useState("");
  const [classNamesMap, setClassNamesMap] = useState({});
  const [termNamesMap, setTermNamesMap] = useState({});
  const [statusMap, setStatusMap] = useState({});
  const [filteredStudents, setFilteredStudents] = useState([]);

  const { user } = useContext(AuthContext);

  useEffect(() => {
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

  // Filter students based on approval status
  useEffect(() => {
    if (students.length > 0 && Object.keys(statusMap).length > 0) {
      const filtered = students.filter(student => 
        statusMap[student.studentID] !== 'approved'
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [students, statusMap]);

  const fetchClassesFromSubject = async () => {
    try {
      const data = await getSubjectWithName(subjectSelected);
      const classId = data[0]?.class;
      const term = data[0]?.term;
      
      setClasses(classId);
      setTerms(term);
  
      if (classId) {
        const classRes = await getClassById(classId);
        setClassName(classRes.data.name);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const fetchStudentsInAClasses = async () => {
    try {
      const data = await getStudentsByClass(classes)
      setStudents(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      if (user && user._id) {
        const data = await getSubjectsByTeacher(user._id);
        setSubjects(data.data);
  
        const classIds = [...new Set(data.data.map(sub => sub.class))];
        const termIds = [...new Set(data.data.map(sub => sub.term))];
  
        const classNames = {};
        await Promise.all(classIds.map(async (id) => {
          const res = await getClassById(id);
          classNames[id] = res.data.name;
        }));
  
        const termNames = {};
        await Promise.all(termIds.map(async (id) => {
          const res = await getAllTerms();
          const foundTerm = res.find(term => term._id === id);
          if (foundTerm) {
            termNames[id] = foundTerm.name;
          }
        }));
  
        setClassNamesMap(classNames);
        setTermNamesMap(termNames);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchStudentScores = async () => {
    try {
      const data = await getResultsByClassAndSubject(classes, subjectSelected);
      const resultArray = Array.isArray(data) ? data : [];
      
      const scoresMap = {};
      const statusAccumulator = {};
      
      students.forEach((student) => {
        const studentScore = resultArray.find(
          (s) => String(s.student_id) === String(student.studentID)
        ) || {};
      
        scoresMap[student.studentID] = {
          assignments: studentScore.assignments || 0,
          test1: studentScore.test1 || 0,
          test2: studentScore.test2 || 0,
          test3: studentScore.test3 || 0,
          exam: studentScore.exam || 0,
        };
      
        statusAccumulator[student.studentID] = (studentScore.status || '').toLowerCase();
      });
      
      setScores(scoresMap);
      setStatusMap(statusAccumulator);
      
      setEditableRows((prev) => {
        const updated = { ...prev };
        Object.keys(statusAccumulator).forEach((id) => {
          if (statusAccumulator[id] === 'approved') {
            updated[id] = false;
          }
        });
        return updated;
      });
      
      if (students.length > 0) {
        setScores(scoresMap);
      }
    } catch (error) {
      console.error("Error fetching student scores:", error);
    }
  };

  const handleScoreChange = (studentId, field, value) => {
    if (!editableRows[studentId]) return;
    setScores({
      ...scores,
      [studentId]: { ...scores[studentId], [field]: Number(value) || 0 },
    });
  };

  const toggleEdit = (studentId) => {
    if (statusMap[studentId] === 'approved') return;
    setEditableRows({
      ...editableRows,
      [studentId]: !editableRows[studentId],
    });
  };

  const handleSaveResults = async (studentId) => {
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
            test3: studentScore.test3 || 0,
            exam: studentScore.exam || 0,
          },
        },
      };
  
      await saveResults(payload);
      alert("Results saved successfully");
      toggleEdit(studentId);
      // Refresh the data after saving
      fetchStudentScores();
    } catch (error) {
      alert("Error saving results");
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Results Management</h2>

      {/* Subject Selection */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Subject</label>
        <select 
          onChange={(e) => setSubjectSelected(e.target.value)} 
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Subject</option>
          {Array.isArray(subjects) &&
            subjects.map((subject) => (
              <option key={subject._id} value={subject.name}>
                {subject.name} - {classNamesMap[subject.class] || subject.class} - {termNamesMap[subject.term] || subject.term}
              </option>
            ))}
        </select>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <div key={student.studentID} className="bg-white rounded-xl shadow-md overflow-hidden p-4">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <FiUser className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{student.admissionNumber}</h3>
                  <p className="text-sm text-gray-500">Class: {className}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {["assignments", "test1", "test2", "test3", "exam"].map((field) => (
                  <div key={field} className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 capitalize">{field.replace('test', 'Test ')}</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={scores[student.studentID]?.[field] || 0}
                      onChange={(e) => handleScoreChange(student.studentID, field, e.target.value)}
                      disabled={!editableRows[student.studentID]}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                {editableRows[student.studentID] ? (
                  <button onClick={() => handleSaveResults(student.studentID)} className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors">
                    <FiSave className="mr-2" /> Save
                  </button>
                ) : (
                  <button onClick={() => toggleEdit(student.studentID)} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                    <FiEdit className="mr-2" /> Edit
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {students.length === 0 ? "No students found" : "All results for this subject are approved"}
            </p>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredStudents.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admission No
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test 1
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test 2
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test 3
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.studentID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.admissionNumber}
                  </td>
                  {["assignments", "test1", "test2", "test3", "exam"].map((field) => (
                    <td key={field} className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        className="w-20 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={scores[student.studentID]?.[field] || 0}
                        onChange={(e) => handleScoreChange(student.studentID, field, e.target.value)}
                        disabled={!editableRows[student.studentID]}
                      />
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editableRows[student.studentID] ? (
                      <button onClick={() => handleSaveResults(student.studentID)} className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Save
                      </button>
                    ) : (
                      <button onClick={() => toggleEdit(student.studentID)} className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {students.length === 0 ? "No students found" : "All results for this subject are approved"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultEntry;