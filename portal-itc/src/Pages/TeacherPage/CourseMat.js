import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { getSubjectsByTeacher } from "../../services/SubjectService";
import AuthContext from '../../context/AuthContext';
// import { getTeacherByID } from '../../services/teacherService'; // Changed from studentService
import {getAllClasses} from "../../services/ClassService";

export default function UploadMaterial() {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    subject: '',
    subjectName: '',
    description: '',
    className: '',
    file: null
  });
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [activeTab, setActiveTab] = useState('upload');
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [Classname, setClasses] = useState(''); // Changed from className
  const [loading, setLoading] = useState(false);
  const [termNamesMap, setTermNamesMap] = useState({});



  const fetchClasses = async () => {
    const data = await getAllClasses();
    setClasses(data);
  };


  const getClassNameById = (classId) => {
    if (!Array.isArray(Classname)) return classId; // Fallback if classes aren't loaded
    const foundClass = Classname.find(cls => cls._id === classId);
    return foundClass ? foundClass.name : classId;
  };



  // const fetchSubjects = async () => {
  //   try {
  //     const res = await getSubjectsByTeacher(user?._id);
  //     console.log('API Response:', res);
      
  //     // Extract the data array from the response
  //     const subjectsData = Array.isArray(res.data) ? res.data : [];
      
  //     setSubjects(subjectsData);
  //   } catch (error) {
  //     console.error('Error fetching subjects:', error);
     
  //     setSubjects([]);
  //   }
  // };

const fetchSubjects = async () => {
  try {
    const res = await getSubjectsByTeacher(user?._id);
    const subjectsData = Array.isArray(res.data) ? res.data : [];
    setSubjects(subjectsData);

    const classIds = [...new Set(subjectsData.map(sub => sub.class))];
    const termIds = [...new Set(subjectsData.map(sub => sub.term))];

    // Fetch class names
    const classMap = {};
    await Promise.all(classIds.map(async (id) => {
      const res = await getAllClasses();
      const found = res.find(cls => cls._id === id);
      if (found) classMap[id] = found.name;
    }));

    // Fetch term names
    const termMap = {};
    const allTerms = await axios.get("/academic/api/terms"); // same as getAllTerms()
    termIds.forEach((id) => {
      const term = allTerms.data.find(t => t._id === id);
      if (term) termMap[id] = term.name;
    });
    setTermNamesMap(termMap);
    
  } catch (error) {
    console.error('Error fetching subjects:', error);
    setSubjects([]);
  }
};




  const fetchMaterials = async () => {
    try {
      setLoadingMaterials(true);
      
      // Make request to fetch materials uploaded by the current user
      const res = await axios.get(`/academic/api/Library/uploaded-by/${user?._id}`);
    
      // Ensure the response is always an array
      setMaterials(Array.isArray(res?.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching materials by user:', error);
      setMaterials([]);
    } finally {
      setLoadingMaterials(false);
    }
  };

  
  
  useEffect(() => {
    fetchClasses();
    fetchSubjects();
    fetchMaterials(); // Now fetches materials uploaded by user
  }, []);
  


  const handleSubjectChange = (e) => {
    const subjectId = e.target.value;
    const selected = subjects.find(sub => sub._id === subjectId);
    
    setSelectedSubject(selected || null);
    setFormData({
      ...formData,
      subject: subjectId,
      subjectName: selected?.name || '',
      className: selected?.class || ''
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('file', formData.file);
    data.append('subject', formData.subject);
    data.append('description', formData.description);
    data.append('class', formData.className);
    data.append('userId', user._id); // Add userId to FormData
  
    try {
      await axios.post('/academic/api/Library/course-materials', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      alert('Material uploaded successfully!');
      fetchMaterials(); // Optional: refresh materials list
  
      // ✅ Reset form
      setFormData({
        subject: '',
        subjectName: '',
        description: '',
        className: '',
        file: null
      });
      setSelectedSubject(null);
  
      // ✅ Reset file input manually (if needed)
      const fileInput = document.getElementById('fileInput');
      if (fileInput) {
        fileInput.value = '';
      }
  
    } catch (error) {
      console.error('Upload error:', error.response?.data || error);
      alert(error.response?.data?.message || 'Upload failed. Please try again.');
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await axios.delete(`/academic/api/Library/${id}`);
        fetchMaterials();
        alert('Material deleted successfully!');
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete material.');
      }
    }
    };
    


  return (
     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-blue-600">Course Materials</h2>
      
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'upload' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('upload')}
        >
          Upload Material
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'view' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('view')}
        >
          View Materials
        </button>
      </div>

      {activeTab === 'upload' ? (
        <form onSubmit={handleSubmit}>
        <div className="mb-4">
  <label className="block text-gray-700 mb-2">Subject</label>
  {loading ? (
    <div className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-500">
      Loading subjects...
    </div>
  ) : (
    <>
      <select
        name="subject"
        value={formData.subject}
        onChange={handleSubjectChange}
        className="w-full px-3 py-2 border rounded-md"
                    required
                    id="fileInput" // ✅ Add this line
      >
        <option value="">Select Subject</option>
        {subjects.map((subject) => (
        <option key={subject._id} value={subject._id}>
        {subject.name} - {getClassNameById(subject.class)} - {termNamesMap[subject.term] || subject.term}
      </option>
      
        ))}
      </select>
      {subjects.length === 0 && !loading && (
        <div className="text-sm text-gray-500 mt-1">
          No subjects found for this teacher
        </div>
      )}
      {selectedSubject && (
      <div className="mt-2 text-sm text-gray-600">
      Selected: {selectedSubject.name} - Class: {getClassNameById(selectedSubject.class)}
    </div>
      )}
    </>
  )}
</div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full px-3 py-2 border rounded-md"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              id="fileInput" // ✅ Add this line
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">File (PDF, DOC, PPT)</label>
            <input
              type="file"
              accept=".pdf"
              className="w-full"
              onChange={(e) => setFormData({...formData, file: e.target.files[0]})}
              required
              id="fileInput" // ✅ Add this line
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Upload Material
          </button>
          </form>
      ) : (
        <div>
          {loadingMaterials ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : Array.isArray(materials) && materials.length > 0 ? (
            <div className="space-y-4">
              {materials.map((material) => (
                <div key={material._id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{material.fileUrl || 'Untitled Material'}</h3>
                      <p className="text-gray-600">{material.description || 'No description'}</p>
                      <p className="text-sm text-gray-500 mt-1">
                      Class: {getClassNameById(material.class?._id)}  • 
                        Uploaded: {material.createdAt ? new Date(material.createdAt).toLocaleDateString() : 'Unknown date'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {/* <a 
                        href={material.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </a> */}
                      <button 
                        onClick={() => handleDelete(material._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No materials found for your subjects.
            </div>
          )}
        </div>
      )}
    </div>
  );
}