import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { getAllUsers, deleteUser, updateUserProfile } from '../../services/userService';
import { register } from '../../services/authService';
import AuthContext from '../../context/AuthContext';
const ManageUsers = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isViewUserModalOpen, setViewUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setEditUserModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const [activePopupId, setActivePopupId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  //  const {registerUser } = useContext(AuthContext);

  const popupRef = useRef();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers(user.token);
        console.log(data)
        setUsers(data);
        
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, [user.token]);



  
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setActivePopupId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const togglePopup = (userId) => {
    setActivePopupId((prev) => (prev === userId ? null : userId));
  };

       // Handle the user update logic here
       const handleUpdateUser = async (updateData) => {
        try {
          await updateUserProfile(user.token, updateData);
          setUsers(users.map(u => u._id === currentUser._id ? {...u, ...updateData} : u));
          setEditUserModalOpen(false);
          alert('User successfully updated!');
        } catch (error) {
          console.error('Failed to update user:', error);
        }
      };
      



  const handleDeleteUser = async (userId) => {
  
    try {
      await deleteUser(user.token, userId);
      setUsers(users.filter((user) => user.id !== userId));
      setDeleteUserModalOpen(false);
      
      alert('User successfully deleted!');
      const updatedUsers = await getAllUsers(user.token);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleAddUser = async (userData) => {
    // setUsers([...users, { id: users.length + 1, ...newUser }]);
    const password = userData.password;
    const confirmPassword = userData.confirmPassword;
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await register(userData);
      const updatedUsers = await getAllUsers(user.token);
      setUsers(updatedUsers);    } catch (err) {
      setError('Failed to register. Please try again.');
    }
    setAddUserModalOpen(false);
    alert('User successfully added!');
  };

  return (
    <div className="p-4 w-full ">
      {/* Upper Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Users</h1>
        <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-2">
          <div className="relative mb-4 sm:mb-0">
            <FaSearch className="absolute top-2.5 left-3 text-gray-400" />
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-64"
              placeholder="Search Users"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setAddUserModalOpen(true)}
            className="flex items-center space-x-2 bg-itccolor text-white px-4 py-2 rounded-md"
          >
            <FaPlus />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* <h2 className="text-2xl font-bold mb-4">Manage Users</h2> */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-500">
            <tr>
              <th className="py-2 pr-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Terminal</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td className="py-2 px-4 border-b"> <span className="bg-gray-300 text-itccolor w-6 h-6 mx-2 rounded-full flex items-center justify-center text-lg font-bold">
            {user.username.charAt(0)}
          </span>  {user.username}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
                <td className="py-2 px-4 border-b">{user.terminal}</td>
                <td className="py-2 px-4 border-b relative">
                  <button
                    onClick={() => togglePopup(user._id)}
                    className="relative"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 12h.01M12 12h.01M18 12h.01"
                      />
                    </svg>
                  </button>
                  {activePopupId === user._id && (
                    <div
                      ref={popupRef}
                      className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg"
                    >
                      <ul>
                        <li>
                          <button
                            onClick={() => {
                              setCurrentUser(user);
                              setViewUserModalOpen(true);
                              setActivePopupId(null);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            View
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              setCurrentUser(user);
                              setEditUserModalOpen(true);
                              setActivePopupId(null);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            Edit
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              setCurrentUser(user);
                              setDeleteUserModalOpen(true);
                              setActivePopupId(null);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
            <div className='bg-itccolor '>
              <h3 className="text-lg font-medium leading-6 text-gray-100 p-6">Add User</h3>
              </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const userData = {
                  username: e.target.username.value,
                  email: e.target.email.value,
                  role: e.target.role.value,
                  // terminal: e.target.terminal.value,
                  password: e.target.password.value,
                  confirmPassword: e.target.confirmPassword.value,

                };
                handleAddUser(userData);
              }}
              className="p-6"
            >
              <div className="mt-4">
                <input
                  name="username"
                  type="text"
                  placeholder="Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mt-4">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mt-4">
                <select
                  name="role"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>


                </select>
              </div>
              {/* <div className="mt-4">
                <input
                  name="terminal"
                  type="text"
                  placeholder="Terminal"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div> */}
              <div className="mt-4">
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
                <div className="mt-4">
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="confirmPassword"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              </div>
              <div className="flex justify-end mt-6 space-x-4">
                <button
                  type="button"
                  onClick={() => setAddUserModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-itccolor text-white rounded-md"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {isViewUserModalOpen && currentUser && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
          <div className='bg-itccolor '>
              <h3 className="text-lg font-medium leading-6 text-gray-100 p-6">View User</h3>
              </div>             <div className="p-6">
              <div className="mb-4">
                <strong>Name:</strong> {currentUser.username}
              </div>
              <div className="mb-4">
                <strong>Email:</strong> {currentUser.email}
              </div>
              <div className="mb-4">
                <strong>Role:</strong> {currentUser.role}
              </div>
              <div className="mb-4">
                <strong>Terminal:</strong> {currentUser.terminal}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setViewUserModalOpen(false)}
                  className="px-4 py-2 bg-itccolor text-white rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditUserModalOpen && currentUser && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
            <h3 className="text-lg font-medium leading-6 text-gray-900 p-6">Edit User</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updateData = {
                  username: e.target.username.value,
                  email: e.target.email.value,
                  role: e.target.role.value,
                  terminal: e.target.terminal.value,
                };
                // Handle the user update logic here
                handleUpdateUser(updateData);
              }}
              className="p-6"
            >
              <div className="mt-4">
                <input
                  name="username"
                  type="text"
                  defaultValue={currentUser.username}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mt-4">
                <input
                  name="email"
                  type="email"
                  defaultValue={currentUser.email}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mt-4">
                <select
                  name="role"
                  defaultValue={currentUser.role}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div className="mt-4">
                <input
                  name="terminal"
                  type="text"
                  defaultValue={currentUser.terminal}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end mt-6 space-x-4">
                <button
                  type="button"
                  onClick={() => setEditUserModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-itccolor text-white rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {isDeleteUserModalOpen && currentUser && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
            <h3 className="text-lg font-medium leading-6 text-gray-900 p-6">Delete User</h3>
            <div className="p-6">
              <p>Are you sure you want to delete {currentUser.username}?</p>
              <div className="flex justify-end mt-6 space-x-4">
                <button
                  onClick={() => setDeleteUserModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUser(currentUser._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
