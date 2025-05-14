

// import React, { useEffect, useState } from 'react';
// import { fetchPendingResults, updateResultsStatus, fetchStudentResults } from '../../../services/examsRecordService';
// import { getAllClasses } from '../../../services/ClassService';
// import { getAllTerms } from '../../../services/termService';
// import {getStudentByAdmission} from '../../../services/studentService'
// // import {getStudentIdByAdmission} from '../../'
// const ManageResults = () => {
//     const [applicationNumber, setApplicationNumber] = useState('');
//     const [results, setResults] = useState(null);
//     const [loading1, setLoading1] = useState(false);
//     const [selectedClass, setSelectedClass] = useState('');
//     const [selectedTerm, setSelectedTerm] = useState('');
//     const [term, setTerm] = useState('');
//     const [classSelected, setClassSelected] = useState('');
//     const [students, setStudents] = useState([]);
//     const [terms, setTerms] = useState([]);
//     const [classes, setClasses] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         fetchClasses();
//         fetchTerms();
//     }, []);

//     const fetchClasses = async () => {
//         try {
//             const data = await getAllClasses();
//             setClasses(data);
//         } catch (error) {
//             console.error('Error fetching classes:', error);
//         }
//     };

//     const fetchTerms = async () => {
//         try {
//             const data = await getAllTerms();
//             setTerms(data);
//         } catch (error) {
//             console.error('Error fetching terms:', error);
//         }
//     };

//     const fetchResults = async () => {
//         if (!term || !classSelected) {
//             setError('Please select a term and class');
//             return;
//         }

//         setLoading(true);
//         setError('');
//         try {
//             const data = await fetchPendingResults(term, classSelected);
//             setStudents(data);
//         } catch (err) {
//             setError('No pending results found');
//         } finally {
//             setLoading(false);
//         }
//     };
//     const handleUpdateStatus = async (status) => {
//         if (!term || !classSelected) {
//             setError('Please select a term and class');
//             return;
//         }
    
//         try {
//             // Call API to update status for all students in the selected term & class
//             await updateResultsStatus(term, classSelected, status);
    
//             // Fetch updated results
//             const updatedResults = await fetchPendingResults(term, classSelected);
    
//             // If no pending results, clear the students list
//             setStudents(updatedResults.length > 0 ? updatedResults : []);
//         } catch (err) {
//             setError('Error updating results');
//         }
//     };



//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading1(true);
//         setError('');
//         try {
//            // First fetch student by admission number
//            const student = await getStudentByAdmission(applicationNumber);
//             console.log(student)
//            if (!student) {
//                throw new Error('Student not found with this application number');
//            }

//            // Then fetch results with studentID, class, and term
//            const resultData = await fetchStudentResults(
//                student.studentID, 
//                selectedClass, 
//                selectedTerm
//            );
//            console.log(resultData, "Uzanna")

//            setResults(resultData);
//         } catch (err) {
//             setError(err.response?.data?.message || 'Failed to fetch results');
//             setResults(null);
//         } finally {
//             setLoading1(false);
//         }
//     };
//     console.log(results, 'resultData')
//     return (
//         <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
//             <h2 className="text-2xl font-bold mb-4">Manage Student Results</h2>




//             <div className="container mx-auto p-4">
//             <h1 className="text-2xl font-bold mb-4">Check Your Results</h1>
//             <form onSubmit={handleSubmit} className="max-w-md space-y-4">
//                 <div>
//                     <label className="block mb-2">Application Number</label>
//                     <input
//                         type="text"
//                         value={applicationNumber}
//                         onChange={(e) => setApplicationNumber(e.target.value)}
//                         className="w-full p-2 border rounded"
//                         required
//                     />
//                 </div>
                
//                 <div>
//                     <label className="block mb-2">Class</label>
//                     <select
//                         value={selectedClass}
//                         onChange={(e) => setSelectedClass(e.target.value)}
//                         className="w-full p-2 border rounded"
//                         required
//                     >
//                         <option value="">Select Class</option>
//                         {classes.map(cls => (
//                             <option key={cls._id} value={cls._id}>
//                                 {cls.name}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 <div>
//                     <label className="block mb-2">Term</label>
//                     <select
//                         value={selectedTerm}
//                         onChange={(e) => setSelectedTerm(e.target.value)}
//                         className="w-full p-2 border rounded"
//                         required
//                     >
//                         <option value="">Select Term</option>
//                         {terms.map(term => (
//                             <option key={term._id} value={term._id}>
//                                 {term.name}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 <button
//                     type="submit"
//                     className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                     disabled={loading1}
//                 >
//                     {loading1 ? 'Loading...' : 'Check Results'}
//                 </button>

//                 {error && <p className="text-red-500">{error}</p>}
//             </form>

//             {results && (
//                 <div className="mt-4 p-4 border rounded">
//                     <h2 className="text-xl font-bold mb-2">Results</h2>
//                     {/* Keep your existing results table structure here */}
//                     <table className="w-full border-collapse border">
//                         <thead>
//                             <tr>
//                                 <th className="border p-2">Subject</th>
//                                 <th className="border p-2">Assignments</th>
//                                 <th className="border p-2">Test1</th>
//                                 <th className="border p-2">Test2</th>
//                                 <th className="border p-2">Test3</th>
//                                 <th className="border p-2">Exam</th>
//                                 <th className="border p-2">Total Score</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//   {Array.isArray(results?.results) ? (
//     results.results.map((result) => (
//       <tr key={result._id}>
//         <td className="border p-2">{result.subject}</td>
//         <td className="border p-2">{result.assignments}</td>
//         <td className="border p-2">{result.test1}</td>
//         <td className="border p-2">{result.test2}</td>
//         <td className="border p-2">{result.test3}</td>
//         <td className="border p-2">{result.exam}</td>
//         <td className="border p-2">{result.total_score}</td>
//       </tr>
//     ))
//   ) : (
//     <tr>
//       <td colSpan="7" className="border p-2 text-center">No results found</td>
//     </tr>
//   )}
// </tbody>
//                     </table>

//                     <div className="mt-4 p-2 border rounded bg-gray-100">
//                         <p className="font-bold">Total Score: {results.totalScore}</p>
//                         <p className="font-bold">Grade: {results.grade}</p>
//                         <p className="font-bold">Comment: {results.comment}</p>
//                     </div>
//                 </div>
//             )}
//         </div>





//             <div className="flex space-x-4 mb-4">
//             <h1 className="text-2xl font-bold mb-4">Approve Result</h1>
//                 <select className="p-2 border rounded" value={term} onChange={(e) => setTerm(e.target.value)}>
//                     <option value="">Select Term</option>
//                     {terms.map((term) => (
//                         <option key={term._id} value={term._id}>
//                             {term.name}
//                         </option>
//                     ))}
//                 </select>

//                 <select className="p-2 border rounded" value={classSelected} onChange={(e) => setClassSelected(e.target.value)}>
//                     <option value="">Select Class</option>
//                     {classes.map((cls) => (
//                         <option key={cls._id} value={cls._id}>
//                             {cls.name}
//                         </option>
//                     ))}
//                 </select>

//                 <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={fetchResults}>
//                     Fetch Results
//                 </button>
//             </div>

//             {error && <p className="text-red-500">{error}</p>}
//             {loading && <p>Loading...</p>}

            







// {students.length > 0 && (
//     <div className="w-full bg-white shadow-md rounded-lg overflow-hidden p-4">
//         <table className="w-full">
//             <thead className="bg-blue-500 text-white">
//                 <tr>
//                     <th className="p-2 text-left">Student Name</th>
//                     <th className="p-2 text-left">Student Status</th>

//                 </tr>
//             </thead>
//             <tbody>
//                 {students.map((student) => (
//                     <tr key={student._id} className="border-t">
//                         <td className="p-2">{student.name}</td>
//                         <td className="p-2">{student.status}</td>
//                     </tr>
//                 ))}
//             </tbody>
//         </table>

//         <button
//             className="mt-4 px-6 py-2 bg-green-500 text-white rounded"
//             onClick={() => handleUpdateStatus('approved')}
//         >
//             Approve All
//         </button>
//     </div>
// )}
//         </div>
//     );
// };

// export default ManageResults;








import React, { useEffect, useState } from 'react'; 
import { fetchPendingResults, updateResultsStatus, fetchStudentResults } from '../../../services/examsRecordService';
 import { getAllClasses } from '../../../services/ClassService';
  import { getAllTerms } from '../../../services/termService'; 
  import { getStudentByAdmission } from '../../../services/studentService';
  import ComputationManagementPage from "../OverAllSubPages/ExamComputationPage";
import { MdAssessment } from "react-icons/md";


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
                const data = await fetchPendingResults(term, classSelected);
                setStudents(data);
            } catch (err) {
                setError('No pending results found');
            } finally {
                setLoading(false);
            }
        };
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

        setResults(resultData);
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
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
                    <button onClick={() => setShowOverlay(false)} className="absolute top-2 right-2 text-gray-600">X</button>
                    <h2 className="text-xl font-bold mb-2">Results</h2>
                    <table className="w-full border-collapse border">
                        <thead>
                            <tr>
                                <th className="border p-2">Subject</th>
                                <th className="border p-2">Assignments</th>
                                <th className="border p-2">Test1</th>
                                <th className="border p-2">Test2</th>
                                <th className="border p-2">Test3</th>
                                <th className="border p-2">Exam</th>
                                <th className="border p-2">Total Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.results.map((result) => (
                                <tr key={result._id}>
                                    <td className="border p-2">{result.subject}</td>
                                    <td className="border p-2">{result.assignments}</td>
                                    <td className="border p-2">{result.test1}</td>
                                    <td className="border p-2">{result.test2}</td>
                                    <td className="border p-2">{result.test3}</td>
                                    <td className="border p-2">{result.exam}</td>
                                    <td className="border p-2">{result.total_score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-4 p-2 border rounded bg-gray-100">
                        <p className="font-bold">Total Score: {results.totalScore}</p>
                        <p className="font-bold">Grade: {results.grade}</p>
                        <p className="font-bold">Comment: {results.comment}</p>
                    </div>
                    <button onClick={handlePrint} className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                        Print Results
                    </button>
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
)}
    </div>
);

};

export default ManageResults;

