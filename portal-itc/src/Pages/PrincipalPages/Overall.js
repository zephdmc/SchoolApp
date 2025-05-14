// import React from "react";
// import ClassManagementPage from "./OverAllSubPages/ClassManagementPage";
// import SessionManagementPage from "./OverAllSubPages/SessionManagmentPage";
// import SubjectManagementPage from "./OverAllSubPages/SubjectManagementPage";
// import TermManagementPage from "./OverAllSubPages/TermManagementPage";
// import ComputationManagementPage from "./OverAllSubPages/ExamComputationPage";
// const Overall = () => {


//   return (
//     <div className="bg-white shadow rounded p-4">
//       <h2 className="text-lg font-bold mb-4">Manage Subjects & Sessions</h2>
//          <ClassManagementPage />
//          <TermManagementPage />
//       <SessionManagementPage />
//       <SubjectManagementPage />
//       <ComputationManagementPage />
//     </div>
//   );
// };

// export default Overall;



import React, { useState } from "react";
import ClassManagementPage from "./OverAllSubPages/ClassManagementPage";
import SessionManagementPage from "./OverAllSubPages/SessionManagmentPage";
import SubjectManagementPage from "./OverAllSubPages/SubjectManagementPage";
import TermManagementPage from "./OverAllSubPages/TermManagementPage";
// import { MdLibraryBooks } from "react-icons/md";
// import { FaCalendarAlt } from "react-icons/fa";
const Overall = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);

  const sections = [
    { title: "Class Management", text: "Use the Class Management Panel to add and organize classes efficiently. Ensure that each class is created correctly before assigning students, subjects, or teachers. Once a class is in use, do not delete it to maintain data integrity and avoid disrupting linked records. Instead, consider archiving or disabling the class if necessary.", component: <ClassManagementPage /> },
    { title: "Term Management", text: "Use the Term Management Panel to define academic terms and structure your institution's calendar. Ensure each term is set up correctly before linking it to sessions, classes, or results. Once a term is in use, do not delete it to prevent data inconsistencies. If needed, consider marking the term as inactive instead of removing it.", component: <TermManagementPage /> },
    { title: "Session Management", text: "Use the Session Management Panel to create and organize academic sessions efficiently. Each session should be added before associating it with terms, classes, and results. Do not delete a session once it is in use to avoid data loss and inconsistencies. If necessary, mark it as inactive instead.", component: <SessionManagementPage /> },
    { title: "Subject Management", text: "Manage subjects for different classes in the Subject Management Panel. Ensure subjects are assigned correctly and structured based on the curriculum. Avoid deleting subjects after they have been assigned to a class to maintain result integrity. Instead, consider updating or deactivating them if changes are needed.",  component: <SubjectManagementPage /> },
  ];

  const handleCloseModal = () => {
    setSelectedComponent(null);
  };

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-bold mb-4">Manage Subjects & Sessions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-md font-semibold mb-2">{section.title}</h3>
            <p className='text-md text-gray-400 py-2 '>{section.text}
            </p>
            <button
              onClick={() => setSelectedComponent(section.component)}
              className="bg-itccolor text-white px-4 py-2 rounded hover:bg-gray-900 transition-colors"
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
  );
};

export default Overall;