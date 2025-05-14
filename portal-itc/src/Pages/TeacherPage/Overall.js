import React, { useState, useEffect } from "react";
import { getAllSubject, createSubject }  from "../../services/SubjectService";
import { createSession, getAllSessions } from "../../services/SessionService";

const Overall = () => {
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [newSession, setNewSession] = useState("");

  const fetchSubjects = async () => {
    const data = await getAllSubject();
    setSubjects(data);
  };

  const fetchSessions = async () => {
    const data = await getAllSessions();
    setSessions(data);
  };

  const handleAddSubject = async () => {
    if (newSubject) {
      await createSubject({ name: newSubject });
      setNewSubject("");
      fetchSubjects();
    }
  };

  const handleAddSession = async () => {
    if (newSession) {
      await createSession({ year: newSession });
      setNewSession("");
      fetchSessions();
    }
  };

  
  useEffect(() => {
    fetchSubjects();
    fetchSessions();
  }, []);


  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-bold mb-4">Manage Subjects & Sessions</h2>
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Subjects</h3>
        <div className="flex mb-4">
          <input
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="Enter subject name"
            className="border p-2 flex-grow rounded"
          />
          <button
            onClick={handleAddSubject}
            className="bg-blue-600 text-white px-4 py-2 rounded ml-2"
          >
            Add
          </button>
        </div>
        <ul>
          {subjects.map((subject) => (
            <li key={subject._id} className="border-b py-2">{subject.name}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Sessions</h3>
        <div className="flex mb-4">
          <input
            type="text"
            value={newSession}
            onChange={(e) => setNewSession(e.target.value)}
            placeholder="Enter session year"
            className="border p-2 flex-grow rounded"
          />
          <button
            onClick={handleAddSession}
            className="bg-blue-600 text-white px-4 py-2 rounded ml-2"
          >
            Add
          </button>
        </div>
        <ul>
          {sessions.map((session) => (
            <li key={session._id} className="border-b py-2">{session.year}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Overall;
