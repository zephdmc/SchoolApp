import React, { useEffect, useState } from 'react'; 
import { fetchPendingResults, updateResultsStatus, fetchStudentResults, updateSingleResultStatus, updateSubjectResultStatus, fetchStudentPendingResults, fetchAllStudentsInClass } from '../../../services/examsRecordService';
 import { getAllClasses } from '../../../services/ClassService';
import { getAllTerms } from '../../../services/termService'; 
import { getStudentsByClass } from '../../../services/studentService'; 


  import { getStudentByAdmission } from '../../../services/studentService';
  import ComputationManagementPage from "../OverAllSubPages/ExamComputationPage";
import { MdAssessment } from "react-icons/md";
import { fetchStudentByID, } from "../../../services/studentService";

const ManageResults = () => { 
    const [applicationNumber, setApplicationNumber] = useState(''); 
    const [results, setResults] = useState(null); 
    const [loading1, setLoading1] = useState(false); 
    const [selectedClass, setSelectedClass] = useState(''); 
    const [selectedTerm, setSelectedTerm] = useState(''); 
    const [term, setTerm] = useState(''); 
    const [classSelected, setClassSelected] = useState(''); 
    const [students, setStudents] = useState([]); 
    const [terms, setTerms] = useState([]); 
    const [classes, setClasses] = useState([]); 
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(''); 
    const [showOverlay, setShowOverlay] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [studentResults, setStudentResults] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
// Add this state
const [statusFilter, setStatusFilter] = useState('all');

// Filter students before rendering
useEffect(() => {
    fetchClasses();
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

const fetchTerms = async () => {
    try {
        const data = await getAllTerms();
        setTerms(data);
    } catch (error) {
        console.error('Error fetching terms:', error);
    }
};

const fetchResults = async () => {
    if (!term || !classSelected) {
      setError('Please select a term and class');
      return;
    }
  
    setLoading(true);
    setError('');
    try {
      // First get all students in the class
      const classStudents = await getStudentsByClass(classSelected);
      
      // Then get their results status
      const studentsWithStatus = await Promise.all(
        classStudents.map(async (student) => {
          try {
            const results = await fetchStudentResults(
              student.studentID,
              classSelected,
              term
            );
            
            return {
              ...student,
              name: `${student.firstName} ${student.lastName}`,
              status: results?.results?.length ? 
                (results.results.every(r => r.status === 'approved') ? 'approved' : 'pending') : 
                'no-results'
            };
          } catch (error) {
            return {
              ...student,
              name: `${student.firstName} ${student.lastName}`,
              status: 'error'
            };
          }
        })
      );
      
      setStudents(studentsWithStatus);
    } catch (err) {
      setError('Error fetching students and results');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

const filteredStudents = statusFilter === 'all' 
    ? students 
    : students.filter(s => s.status === statusFilter);

        const handleUpdateStatus = async (status) => {
            if (!term || !classSelected) {
                setError('Please select a term and class');
                return;
            }
        
            try {
                // Call API to update status for all students in the selected term & class
                await updateResultsStatus(term, classSelected, status);
        
                // Fetch updated results
                const updatedResults = await fetchPendingResults(term, classSelected);
        
                // If no pending results, clear the students list
                setStudents(updatedResults.length > 0 ? updatedResults : []);
            } catch (err) {
                setError('Error updating results');
            }
    };
    
    const handleSingleApprove = async (studentId) => {
        try {
          await updateSingleResultStatus(studentId, term, classSelected, 'approved');
          // Update local state
          setStudents(students.map(student => 
            student.studentID === studentId 
              ? { ...student, status: 'approved' } 
              : student
          ));
        } catch (err) {
          setError('Error approving student result');
        }
      };
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading1(true);
            setError('');
            try {
                const student = await getStudentByAdmission(applicationNumber);
                if (!student) {
                    throw new Error('Student not found with this application number');
                }
        
                const resultData = await fetchStudentResults(
                    student.studentID,
                    selectedClass,
                    selectedTerm
                );
        
                const studentDetails = await fetchStudentByID(student.studentID);
                
                // Handle case where studentDetails might be an array
                const studentData = Array.isArray(studentDetails) ? studentDetails[0] : studentDetails;
        
                setResults({
                    ...resultData,
                    student: studentData // Use the properly formatted student data
                });
                setShowOverlay(true);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch results');
                setResults(null);
            } finally {
                setLoading1(false);
            }
        };

    

const handlePrint = () => {
    window.print();
};



const sections = [
  { title: "EXAM COPUTATION", component: <ComputationManagementPage /> }
];

const handleCloseModal = () => {
  setSelectedComponent(null);
};

const handleViewResults = async (student) => {
    setSelectedStudent(student);
    setLoading(true);
    try {
      const data = await fetchStudentResults(
        student.studentID,
        classSelected,
        term
      );
      
      if (!data) {
        throw new Error('No results found');
      }
      
      setStudentResults({
        student: {
          name: `${student.firstName} ${student.lastName}`,
          admissionNumber: student.admissionNumber,
          ...student
        },
        results: data.results || []
      });
    } catch (error) {
      setError('Failed to fetch student results');
      setStudentResults({
        student: {
          name: `${student.firstName} ${student.lastName}`,
          admissionNumber: student.admissionNumber || 'N/A'
        },
        results: []
      });
    } finally {
      setLoading(false);
    }
  };

    // Add this new function
    const handleApproveSubject = async (resultId) => {
        try {
            await updateSubjectResultStatus(resultId, 'approved');
            // Update local state
            setStudentResults(prev => ({
                ...prev,
                results: prev.results.map(result => 
                    result._id === resultId 
                        ? { ...result, status: 'approved' } 
                        : result
                )
            }));
        } catch (error) {
            setError('Failed to approve subject result');
        }
    };

    // Add this new function
    const handleUnapproveSubject = async (resultId) => {
        try {
            await updateSubjectResultStatus(resultId, 'pending');
            // Update local state
            setStudentResults(prev => ({
                ...prev,
                results: prev.results.map(result => 
                    result._id === resultId 
                        ? { ...result, status: 'pending' } 
                        : result
                )
            }));
        } catch (error) {
            setError('Failed to unapprove subject result');
        }
    };

    // Add this new function
    const handleApproveAllSubjects = async () => {
        try {
            await updateSingleResultStatus(selectedStudent.studentID, term, classSelected, 'approved');
            // Update local state
            setStudentResults(prev => ({
                ...prev,
                results: prev.results.map(result => ({
                    ...result,
                    status: 'approved'
                }))
            }));
            // Also update the main students list
            setStudents(students.map(student => 
                student.studentID === selectedStudent.studentID 
                    ? { ...student, status: 'approved' } 
                    : student
            ));
        } catch (error) {
            setError('Failed to approve all subjects');
        }
    };

return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg relative">
        <h2 className="text-2xl font-bold mb-4">Manage Student Results</h2>

<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4'>
        <form onSubmit={handleSubmit} className="max-w-md space-y-4">
            <div>
                <label className="block mb-2">Application Number</label>
                <input
                    type="text"
                    value={applicationNumber}
                    onChange={(e) => setApplicationNumber(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div>
                <label className="block mb-2">Class</label>
                <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                        <option key={cls._id} value={cls._id}>{cls.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block mb-2">Term</label>
                <select
                    value={selectedTerm}
                    onChange={(e) => setSelectedTerm(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                >
                    <option value="">Select Term</option>
                    {terms.map(term => (
                        <option key={term._id} value={term._id}>{term.name}</option>
                    ))}
                </select>
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" disabled={loading1}>
                {loading1 ? 'Loading...' : 'Check Results'}
            </button>
            {error && <p className="text-red-500">{error}</p>}
        </form>
      
            



        {showOverlay && results && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-gray-800">Student Results</h2>
                <button 
                    onClick={() => setShowOverlay(false)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Content - Scrollable Area */}
            <div className="overflow-y-auto p-4 flex-1">
                {/* Student Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                    {(() => {
                        const student = Array.isArray(results.student) ? results.student[0] : results.student;
                        if (!student) return null;

                        const infoItems = [
                            { label: "Name", value: `${student.firstName || ''} ${student.middleName || ''} ${student.lastName || ''}`.trim() },
                            { label: "Admission No", value: student.admissionNumber },
                            { label: "Class", value: classes.find(c => c._id === (student.class || selectedClass))?.name },
                            { label: "Term", value: terms.find(t => t._id === selectedTerm)?.name },
                            { label: "Gender", value: student.gender },
                            { label: "Session", value: student.section }
                        ];

                        return infoItems.map((item, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <p className="text-sm font-medium text-gray-500">{item.label}</p>
                                <p className="font-semibold">{item.value || 'N/A'}</p>
                            </div>
                        ));
                    })()}
                </div>

                {/* Results Table */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">Subject Scores</h3>
                    {results.results?.length > 0 ? (
                        <div className="border rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-3 text-left text-sm font-medium text-gray-700">Subject</th>
                                            <th className="p-3 text-center text-sm font-medium text-gray-700">Assign</th>
                                            <th className="p-3 text-center text-sm font-medium text-gray-700">Test 1</th>
                                            <th className="p-3 text-center text-sm font-medium text-gray-700">Test 2</th>
                                            <th className="p-3 text-center text-sm font-medium text-gray-700">Test 3</th>
                                            <th className="p-3 text-center text-sm font-medium text-gray-700">Exam</th>
                                            <th className="p-3 text-center text-sm font-medium text-gray-700">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {results.results.map((result, index) => (
                                            <tr key={result._id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="p-3 text-sm font-medium text-gray-900">{result.subject || 'N/A'}</td>
                                                <td className="p-3 text-sm text-center text-gray-500">{result.assignments ?? 'N/A'}</td>
                                                <td className="p-3 text-sm text-center text-gray-500">{result.test1 ?? 'N/A'}</td>
                                                <td className="p-3 text-sm text-center text-gray-500">{result.test2 ?? 'N/A'}</td>
                                                <td className="p-3 text-sm text-center text-gray-500">{result.test3 ?? 'N/A'}</td>
                                                <td className="p-3 text-sm text-center text-gray-500">{result.exam ?? 'N/A'}</td>
                                                <td className="p-3 text-sm text-center font-semibold text-blue-600">{result.total_score ?? 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                            <p className="text-yellow-700">No results found for this student</p>
                        </div>
                    )}
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col items-center">
                        <p className="text-sm font-medium text-blue-800 mb-1">Total Score</p>
                        <p className="text-3xl font-bold text-blue-600">{results.totalScore ?? 'N/A'}</p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex flex-col items-center">
                        <p className="text-sm font-medium text-green-800 mb-1">Grade</p>
                        <p className="text-3xl font-bold text-green-600">{results.grade ?? 'N/A'}</p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                        <p className="text-sm font-medium text-purple-800 mb-1">Teacher's Comment</p>
                        <p className="text-lg text-purple-600">{results.comment ?? 'No comment available'}</p>
                    </div>
                </div>
            </div>

            {/* Footer with Actions */}
            <div className="p-4 border-t flex justify-end gap-3 sticky bottom-0 bg-white">
                <button 
                    onClick={handlePrint}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print
                </button>
                <button 
                    onClick={() => setShowOverlay(false)}
                    className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors text-sm"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
)}

<div className="  max-w-md space-y-4">
        {sections.map((section, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div><MdAssessment className='text-4xl text-itccolor'/> </div>
            <h3 className="text-lg font-semibold ">{section.title}</h3>
            <p className='text-md text-gray-400 py-2 '>
            Use the Exam Computation feature to
             set exam rules for each class, ensuring 
             standardized grading criteria. This allows
              you to define weightages for assessments, exams, 
              and overall scores. With these rules in place, manually
               computed results will align with the system's automated 
               calculations, ensuring accuracy and consistency across all classes."


            </p>
            <button
              onClick={() => setSelectedComponent(section.component)}
              className="bg-itccolor text-white px-4 py-2 rounded hover:bg-itccolor transition-colors"
            >
              Manage →
            </button>
          </div>
        ))}
      </div>

      {selectedComponent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Management Panel</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            {selectedComponent}
          </div>
        </div>
      )}

        
</div>


     

             <div className="flex space-x-4 py-6 mb-4">
            <h1 className="text-2xl font-bold mb-4">Approve Result</h1>
                <select className="p-2 border rounded" value={term} onChange={(e) => setTerm(e.target.value)}>
                    <option value="">Select Term</option>
                    {terms.map((term) => (
                        <option key={term._id} value={term._id}>
                            {term.name}
                        </option>                  
                      ))}             
                         </select>
                <select className="p-2 border rounded" value={classSelected} onChange={(e) => setClassSelected(e.target.value)}>                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                         <option key={cls._id} value={cls._id}>
                             {cls.name}
                         </option>
                     ))}
                 </select>

                 <button className="px-4 py-2 bg-itccolor text-white rounded" onClick={fetchResults}>
                     Fetch Results
                 </button>             </div>

             {error && <p className="text-red-500">{error}</p>}
            {loading && <p>Loading...</p>}

            
            {filteredStudents.length > 0 ? (
  <div className="w-full bg-white shadow-md rounded-lg overflow-hidden p-4">
    <table className="w-full">
      <thead className="bg-blue-500 text-white">
        <tr>
          <th className="p-2 text-left">Student Name</th>
          <th className="p-2 text-left">Admission No</th>
          <th className="p-2 text-left">Status</th>
          <th className="p-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredStudents.map((student) => (
          <tr key={student.studentID} className="border-t hover:bg-gray-50">
            <td className="p-2">{student.name}</td>
            <td className="p-2">{student.admissionNumber}</td>
            <td className="p-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                student.status === 'approved' ? 'bg-green-100 text-green-800' : 
                student.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                student.status === 'no-results' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {student.status === 'approved' ? 'Approved' : 
                 student.status === 'pending' ? 'Pending' :
                 student.status === 'no-results' ? 'No Results' : 'Error'}
              </span>
            </td>
            <td className="p-2 space-x-2">
              <button
                onClick={() => handleViewResults(student)}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                View
              </button>
              {/* <button
                onClick={() => handleSingleApprove(student.studentID)}
                disabled={student.status === 'approved' || student.status === 'no-results'}
                className={`px-3 py-1 rounded text-sm ${
                  student.status === 'approved' ? 
                  'bg-gray-200 text-gray-500 cursor-not-allowed' : 
                  student.status === 'no-results' ?
                  'bg-gray-200 text-gray-500 cursor-not-allowed' :
                  'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {student.status === 'approved' ? 'Approved' : 
                 student.status === 'no-results' ? 'No Results' : 'Approve'}
              </button> */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  <div className="w-full bg-white shadow-md rounded-lg overflow-hidden p-4">
    <p className="text-center py-4 text-gray-500">
      {loading ? 'Loading students...' : 'No students found in this class'}
    </p>
  </div>
)}
         {studentResults && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-800">
                                {studentResults.student.name}'s Pending Results
                            </h2>
                            <button 
                                onClick={() => setStudentResults(null)}
                                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="overflow-y-auto p-4 flex-1">
                            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <p className="text-sm font-medium text-gray-500">Student Name</p>
                                <p className="font-semibold">{studentResults?.student?.name || 'N/A'}</p>
                            </div>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <p className="text-sm font-medium text-gray-500">Admission No</p>
                                <p className="font-semibold">{studentResults?.student?.admissionNumber || 'N/A'}</p>
                            </div>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <p className="text-sm font-medium text-gray-500">Class</p>
                                    <p className="font-semibold">{classes.find(c => c._id === classSelected)?.name || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3 text-gray-700">Subject Results</h3>
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="p-3 text-left text-sm font-medium text-gray-700">Subject</th>
                                                    <th className="p-3 text-center text-sm font-medium text-gray-700">Test 1</th>
                                                    <th className="p-3 text-center text-sm font-medium text-gray-700">Test 2</th>
                                                    <th className="p-3 text-center text-sm font-medium text-gray-700">Test 3</th>
                                                    <th className="p-3 text-center text-sm font-medium text-gray-700">Exam</th>
                                                    <th className="p-3 text-center text-sm font-medium text-gray-700">Total</th>
                                                    <th className="p-3 text-center text-sm font-medium text-gray-700">Status</th>
                                                    <th className="p-3 text-center text-sm font-medium text-gray-700">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {studentResults.results.map((result) => (
                                                    <tr key={result._id} className={result.status === 'approved' ? 'bg-green-50' : 'bg-white'}>
                                                        <td className="p-3 text-sm font-medium text-gray-900">{result.subject || 'N/A'}</td>
                                                        <td className="p-3 text-sm text-center text-gray-500">{result.test1 ?? 'N/A'}</td>
                                                        <td className="p-3 text-sm text-center text-gray-500">{result.test2 ?? 'N/A'}</td>
                                                        <td className="p-3 text-sm text-center text-gray-500">{result.test3 ?? 'N/A'}</td>
                                                        <td className="p-3 text-sm text-center text-gray-500">{result.exam ?? 'N/A'}</td>
                                                        <td className="p-3 text-sm text-center font-semibold text-blue-600">{result.total_score ?? 'N/A'}</td>
                                                        <td className="p-3 text-sm text-center">
                                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                                result.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                                'bg-green-100 text-green-800'
                                                            }`}>
                                                                {result.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-3 text-sm text-center space-x-1">
                                                            {result.status === 'pending' ? (
                                                                <button
                                                                    onClick={() => handleApproveSubject(result._id)}
                                                                    className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                                                                >
                                                                    Approve
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleUnapproveSubject(result._id)}
                                                                    className="px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600"
                                                                >
                                                                    Unapprove
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t flex justify-between sticky bottom-0 bg-white">
                            {/* <button
                                onClick={handleApproveAllSubjects}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
                            >
                                Approve All Subjects
                            </button> */}
                            <button
                                onClick={() => setStudentResults(null)}
                                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

{/*    

 {students.length > 0 && (
    <div className="w-full bg-white shadow-md rounded-lg overflow-hidden p-4">
        <table className="w-full">
            <thead className="bg-blue-500 text-white">
                <tr>
                    <th className="p-2 text-left">Student Name</th>
                    <th className="p-2 text-left">Student Status</th>

                </tr>
            </thead>
            <tbody>
                {students.map((student) => (
                    <tr key={student._id} className="border-t">
                        <td className="p-2">{student.name}</td>
                        <td className="p-2">{student.status}</td>
                    </tr>
                ))}
            </tbody>
        </table>

        <button
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded"
            onClick={() => handleUpdateStatus('approved')}
        >
            Approve All
        </button>
    </div>
)} */}
    </div>
);

};

export default ManageResults;

