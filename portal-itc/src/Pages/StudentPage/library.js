import { useEffect, useState, useContext, useMemo } from 'react';
import AuthContext from '../../context/AuthContext';
import axios from 'axios';
import { FiDownload, FiFile, FiCalendar } from 'react-icons/fi';
import { getStudentById } from '../../services/studentService';
import { getAllTeachers } from '../../services/teacherService';
import { getSubjectById } from '../../services/SubjectService';

export default function CourseMaterials() {
  const [materials, setMaterials] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const [studentClass, setStudentClass] = useState(null);

  const teacherMap = useMemo(() => {
    return teachers.reduce((map, teacher) => {
      map[teacher.teacherID] = teacher;
      return map;
    }, {});
  }, [teachers]);

  const getTeacherName = (teacherId) => {
    if (!teacherId) return 'Unknown Teacher';
    const teacher = teacherMap[teacherId];
    if (!teacher) return 'Loading...';
    if (teacher.name) return teacher.name;
    if (teacher.firstName && teacher.lastName) return `${teacher.firstName} ${teacher.lastName}`;
    return 'Unknown Teacher';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const studentRes = await getStudentById(user._id);
        const student = studentRes.data;
        if (!student || !student.data.class) {
          throw new Error('Student data or class information not found');
        }
        setStudentClass(student.data.class);

        const [materialsRes, teachersRes] = await Promise.all([
          axios.get(`/academic/api/Library/class/${student.data.class}`),
          getAllTeachers()
        ]);
        setTeachers(teachersRes.data || []);
        const materialsData = Array.isArray(materialsRes?.data)
          ? materialsRes.data.map(material => ({
              ...material,
              uploadedBy: material.uploadedBy?._id?.toString() || material.uploadedBy
            }))
          : [];

        // Fetch subject names for each unique subject ID
        const subjectIds = [...new Set(materialsData.map(m => m.subject))].filter(id => id && typeof id === 'string');
   
        const subjectPromises = subjectIds.map(id =>
          getSubjectById(id).catch(err => {
            console.warn(`Failed to fetch subject ${id}:`, {
              status: err.response?.status,
              data: err.response?.data,
              message: err.message
            });
            return { success: false, data: { name: 'Unknown Subject' } };
          })
        );
        const subjectResponses = await Promise.all(subjectPromises);
        const subjectMap = subjectResponses.reduce((map, res, idx) => {
          const subjectId = subjectIds[idx];
          const subjectName = res?.data?.data?.name;
          map[subjectId] = subjectName || 'Unknown Subject';
          if (!subjectName) {
            console.warn(`No valid name for subject ID ${subjectId}:`, res);
          }
          return map;
        }, {});
        

        // Map materials with subject names
        const materialsWithSubjects = materialsData.map(material => ({
          ...material,
          subject: subjectMap[material.subject] || 'Unknown Subject'
        }));

        setMaterials(materialsWithSubjects);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to load course materials');
        setMaterials([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user._id]);

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf': return <FiFile className="text-red-500" />;
      case 'doc': return <FiFile className="text-blue-500" />;
      case 'ppt': return <FiFile className="text-orange-500" />;
      case 'video': return <FiFile className="text-purple-500" />;
      default: return <FiFile className="text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-600 flex items-center">
        <FiFile className="mr-2" /> My Course Materials
      </h1>

      {error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : materials.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">
            {studentClass
              ? `No course materials available for ${studentClass.name || 'your class'} yet.`
              : 'No course materials available.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((material) => (
            <div key={material._id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start mb-3">
                <div className="text-2xl mr-3">
                  {getFileIcon(material.fileType)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{material.subject || 'Untitled Material'}</h3>
                  <p className="text-gray-600 text-sm">
                    {getTeacherName(material.uploadedBy)}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-3">{material.description || 'No description provided'}</p>

              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-500">
                  <FiCalendar className="mr-1" />
                  <span>{formatDate(material.createdAt)}</span>
                </div>
                {material.fileUrl && (
                  // <a
                  //   href={material.fileUrl}
                  //   download
                  //   className="flex items-center bg-blue-100 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-200 transition"
                  // >
                  //   <FiDownload className="mr-1" /> Download
                  // </a>
                  <a
  href={`/academic/api/Library/download/${material._id}`}
  className="flex items-center bg-blue-100 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-200 transition"
>
  <FiDownload className="mr-1" /> Download
</a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}