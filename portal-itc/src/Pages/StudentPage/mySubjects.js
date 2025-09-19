import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import { getStudentById } from "../../services/studentService";
import { getTeacherByID } from "../../services/teacherService";
import { getAllTerms } from "../../services/termService";
import { getAllSessions } from "../../services/sessionService";

const ClassSubjectsView = () => {
  const { user } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [classId, setClassId] = useState("");
  const [terms, setTerms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState("all");

  // ✅ Fetch terms and sessions once
  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const termsData = await getAllTerms();
        const sessionsData = await getAllSessions();

        let termsArray = Array.isArray(termsData?.data?.data)
          ? termsData.data.data
          : termsData.data || termsData;

        let sessionsArray = Array.isArray(sessionsData?.data?.data)
          ? sessionsData.data.data
          : sessionsData.data || sessionsData;

        setTerms(termsArray);
        setSessions(sessionsArray);
      } catch (err) {
        console.error("[ERROR] Fetching terms/sessions failed:", err);
      }
    };
    fetchMetaData();
  }, []);

  // ✅ Fetch student profile
  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      const res = await getStudentById(user?._id);

      let studentData = res?.data?.data || res?.data || res;

      if (studentData?.class) {
        setClassId(studentData.class);
      } else {
        setError("No class assigned to student");
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch student information");
      setLoading(false);
    }
  };

  // ✅ Fetch subjects by class
  const fetchSubjectsByClass = async (classId) => {
    try {
      const response = await axios.get(`/academic/api/subjects/by-class/${classId}`);

      let fetchedSubjects = Array.isArray(response.data?.data)
        ? response.data.data
        : response.data;

      const enrichedSubjects = await Promise.all(
        fetchedSubjects.map(async (subject) => {
          let teacherName = "Not Assigned";
          let termName = "Not Set";
          let sessionName = "Not Set";

          // 🔹 Teacher
          const teacherId = subject.teacher || subject.teacherId || subject.teacherName;
          if (teacherId) {
            try {
              const teacherRes = await getTeacherByID(teacherId);
              let teacherData = teacherRes?.data?.data || teacherRes?.data || teacherRes;
              teacherName =
                teacherData?.name ||
                `${teacherData?.firstName || ""} ${teacherData?.lastName || ""}`.trim() ||
                "Unknown Teacher";
            } catch {
              teacherName = "Error loading teacher";
            }
          }

          // 🔹 Term
          const termId = subject.term || subject.termId;
          if (termId) {
            if (typeof termId === "object") {
              termName = termId.name || termId.termName;
            } else {
              const t = terms.find((x) => x._id === termId);
              termName = t?.name || t?.termName || "Not Set";
            }
          }

          // 🔹 Session
          const sessionId = subject.session || subject.sessionId;
          if (sessionId) {
            if (typeof sessionId === "object") {
              sessionName = sessionId.name || sessionId.sessionName;
            } else {
              const s = sessions.find((x) => x._id === sessionId);
              sessionName = s?.name || s?.sessionName || "Not Set";
            }
          }

          return {
            name: subject.name || subject.subjectName || "Unknown Subject",
            code: subject.code || subject.subjectCode || "N/A",
            teacherName,
            termName,
            sessionName,
            termId: termId?._id || termId, // keep for filtering
          };
        })
      );

      setSubjects(enrichedSubjects);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch subjects");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial fetch
  useEffect(() => {
    if (user?._id) {
      fetchStudentProfile();
    } else {
      setLoading(false);
      setError("User information not available");
    }
  }, [user]);

  // ✅ Fetch subjects once classId, terms, and sessions are ready
  useEffect(() => {
    if (classId && terms.length > 0 && sessions.length > 0) {
      fetchSubjectsByClass(classId);
    }
  }, [classId, terms, sessions]);

  // 🔎 Filter subjects
  const filteredSubjects =
    selectedTerm === "all"
      ? subjects
      : subjects.filter((sub) => sub.termId?.toString() === selectedTerm);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <span className="ml-3 text-indigo-600 font-medium">Loading subjects...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-sm mb-4">
        <strong className="font-bold">Error: </strong>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="class-subjects">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <h3 className="text-2xl font-bold text-gray-800">Class Subjects</h3>

        {/* 🔎 Term filter */}
        <select
          value={selectedTerm}
          onChange={(e) => setSelectedTerm(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        >
          <option value="all">All Terms</option>
          {terms.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name || t.termName}
            </option>
          ))}
        </select>
      </div>

      {filteredSubjects.length === 0 ? (
        <p className="text-gray-500 italic">No subjects found for this filter</p>
      ) : (
        <>
          {/* 🔹 Table for medium+ screens */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead>
                <tr className="bg-indigo-50 text-indigo-700">
                  <th className="py-3 px-4 border-b text-left">Subject Name</th>
                  <th className="py-3 px-4 border-b text-left">Code</th>
                  <th className="py-3 px-4 border-b text-left">Teacher</th>
                  <th className="py-3 px-4 border-b text-left">Session</th>
                  <th className="py-3 px-4 border-b text-left">Term</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.map((subject, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-indigo-50 transition`}
                  >
                    <td className="py-3 px-4 border-b">{subject.name}</td>
                    <td className="py-3 px-4 border-b">{subject.code}</td>
                    <td className="py-3 px-4 border-b">{subject.teacherName}</td>
                    <td className="py-3 px-4 border-b">{subject.sessionName}</td>
                    <td className="py-3 px-4 border-b">{subject.termName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🔹 Card layout for mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {filteredSubjects.map((subject, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition border border-gray-100"
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-1">{subject.name}</h4>
                <p className="text-sm text-gray-500 mb-2">Code: {subject.code}</p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Teacher:</span> {subject.teacherName}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Session:</span> {subject.sessionName}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Term:</span> {subject.termName}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ClassSubjectsView;
