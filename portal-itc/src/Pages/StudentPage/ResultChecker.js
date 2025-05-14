import React, { useEffect, useState, useContext } from 'react';
import { fetchStudentResults } from '../../services/examsRecordService';
import AuthContext from '../../context/AuthContext';
import { getAllClasses } from '../../services/ClassService';
import { getAllTerms } from '../../services/termService';
const ResultChecker = () => {
    const { user } = useContext(AuthContext);
    const [classId, setClassId] = useState('');
    const [terms, setTerms] = useState([]);
    const [classes, setClasses] = useState([]);
    const [termId, setTermId] = useState('');
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

console.log(user._id )
const studentId = user ? user._id : null;

    const handleFetchResults = async () => {
        setError('');
        try {
            const data = await fetchStudentResults(studentId, classId, termId);
            setResults(data);
        } catch (err) {
            setError('Error fetching results. Please check the details and try again.');
        }
    };

      
      const fetchClasses = async () => {
        try {
          const data = await getAllClasses();
          setClasses(data);
        } catch (error) {
          console.error('Error fetching class:', error);
        }
        };
        // const fetchStudentID = async () => {
        //   try {
        //     const data = await fetchStudentByID(studentUserID);
        //     console.log(data)
        //     setStudentID(data.studentID);
        //   } catch (error) {
        //     console.error('Error fetching studentID from students :', error);
        //   }
        //   };
    
       const fetchTerms = async () => {
          try {
            const data = await getAllTerms();
            setTerms(data);
          } catch (error) {
            console.error('Error fetching Terms:', error);
          }
          };
    
    // Fetch all classes and sessions on component mount
    useEffect(() => {
        fetchClasses();
          fetchTerms();
      }, []);
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Student Result Checker</h1>
            
            <div className="mb-4">
                           

        <select
          name="term"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
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
          value={termId}
          onChange={(e) => setTermId(e.target.value)}
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
                    onClick={handleFetchResults} 
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Check Result
                </button>
            </div>

            {error && <div className="text-red-500">{error}</div>}

            {results && (
                <div className="mt-4 p-4 border rounded">
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
  {Array.isArray(results?.results) ? (
    results.results.map((result) => (
      <tr key={result._id}>
        <td className="border p-2">{result.subject}</td>
        <td className="border p-2">{result.assignments}</td>
        <td className="border p-2">{result.test1}</td>
        <td className="border p-2">{result.test2}</td>
        <td className="border p-2">{result.test3}</td>
        <td className="border p-2">{result.exam}</td>
        <td className="border p-2">{result.total_score}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" className="border p-2 text-center">No results found</td>
    </tr>
  )}
</tbody>
                    </table>

                    <div className="mt-4 p-2 border rounded bg-gray-100">
                        <p className="font-bold">Total Score: {results.totalScore}</p>
                        <p className="font-bold">Grade: {results.grade}</p>
                        <p className="font-bold">Comment: {results.comment}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultChecker;