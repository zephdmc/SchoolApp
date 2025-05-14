import React, { useState, useEffect, useContext } from 'react';
import { fetchStudentsOrResults, submitResults, updateResults } from '../../services/resultService';
import AuthContext from '../../context/AuthContext';

const ResultManagement = () => {
    const { teacher } = useContext(AuthContext);
    
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [classId, setClassId] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [students, setStudents] = useState([]);
    const [results, setResults] = useState([]);
    const [actionType, setActionType] = useState('');

    useEffect(() => {
        // Fetch teacher's assigned classes and subjects
        async function fetchSubjectsAndClasses() {
            const response = await fetch('/api/subject-manager?teacherId=' + teacher._id);
            const data = await response.json();
            setClasses(data.classes);
            setSubjects(data.subjects);
        }
        fetchSubjectsAndClasses();
    }, [teacher]);

    const handleFetchOrUpdate = async () => {
        if (!classId || !subjectId) return alert('Select a class and subject');

        const response = await fetchStudentsOrResults(classId, subjectId, sessionId);
        setActionType(response.type);
        
        if (response.type === 'update') {
            setResults(response.results);
        } else {
            setStudents(response.students);
        }
    };

    const handleSaveOrUpdate = async () => {
        const payload = {
            teacherId: teacher._id,
            classId,
            subjectId,
            sessionId,
            results: actionType === 'update' ? results : students.map(student => ({ studentId: student._id, score: 0 })),
        };

        if (actionType === 'update') {
            await updateResults(payload);
        } else {
            await submitResults(payload);
        }

        alert('Results saved successfully!');
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold">Exam Management</h2>

            <div className="mb-4 flex gap-4">
                <select onChange={e => setClassId(e.target.value)} className="border p-2">
                    <option value="">Select Class</option>
                    {classes.map(cls => <option key={cls._id} value={cls._id}>{cls.name}</option>)}
                </select>

                <select onChange={e => setSubjectId(e.target.value)} className="border p-2">
                    <option value="">Select Subject</option>
                    {subjects.map(sub => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
                </select>

                <button onClick={handleFetchOrUpdate} className="bg-blue-500 text-white p-2 rounded">
                    {actionType === 'update' ? 'Update Results' : 'Fetch Students'}
                </button>
            </div>

            <table className="w-full border">
                <thead>
                    <tr><th>Name</th><th>Score</th></tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student._id}>
                            <td>{student.name}</td>
                            <td><input type="number" className="border" /></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={handleSaveOrUpdate} className="bg-green-500 text-white p-2 mt-4 rounded">
                {actionType === 'update' ? 'Save Update' : 'Submit Scores'}
            </button>
        </div>
    );
};

export default ResultManagement;