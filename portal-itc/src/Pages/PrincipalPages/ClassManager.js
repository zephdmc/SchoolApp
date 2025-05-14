import React, { useState, useEffect } from "react";
import classService from "../services/classService";

const ClassManager = () => {
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState("");

  const fetchClasses = async () => {
    const data = await classService.getClasses();
    setClasses(data);
  };

  const handleAddClass = async () => {
    if (newClass) {
      await classService.createClass({ name: newClass });
      setNewClass("");
      fetchClasses();
    }
  };

  const handleDeleteClass = async (id) => {
    await classService.deleteClass(id);
    fetchClasses();
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div className="bg-white shadow rounded p-4 mb-6">
      <h2 className="text-lg font-bold mb-4">Manage Classes</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={newClass}
          onChange={(e) => setNewClass(e.target.value)}
          placeholder="Enter class name"
          className="border p-2 flex-grow rounded"
        />
        <button
          onClick={handleAddClass}
          className="bg-blue-600 text-white px-4 py-2 rounded ml-2"
        >
          Add
        </button>
      </div>
      <ul>
        {classes.map((cls) => (
          <li
            key={cls._id}
            className="flex justify-between items-center border-b py-2"
          >
            {cls.name}
            <button
              onClick={() => handleDeleteClass(cls._id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassManager;
