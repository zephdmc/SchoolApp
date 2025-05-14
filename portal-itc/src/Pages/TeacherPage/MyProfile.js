import { useEffect, useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { getAllUsers, updateUserProfile } from '../../services/userService';

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [isEditUserModalOpen, setEditUserModalOpen] = useState(false);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers(user.token);
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, [user.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateData = {
      username: e.target.username.value,
      email: e.target.email.value,
      role: e.target.role.value,
      terminal: e.target.terminal.value,
    };
    try {
      await updateUserProfile(user.token, updateData);
      setEditUserModalOpen(false);
      alert('User successfully updated!');
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };


  return (
    <div className="max-w-4xl  p-6 w-full bg-white rounded-lg shadow-lg">
      {/* Column layout */}
      <div className="grid grid-cols-1 mx-[20%] lg:grid-cols-3 gap-6">
        {/* First column - Profile picture and user details */}
        <div className="flex flex-col items-center">
          {/* Profile Picture with First Letter of Username */}
          <div className="bg-gray-300 text-white w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold">
            {user.username.charAt(0)}
          </div>
          {/* User Details */}
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold">ID: {user.id}</p>
            <p className="text-lg font-semibold">Name: {user.username}</p>
            <p className="text-md text-gray-600">Role: {user.role}</p>
            <p className="text-md text-gray-600">Email: {user.email}</p>
            <button
              onClick={() => setEditUserModalOpen(true)}
              className='w-full bg-itccolor py-2 text-white hover:bg-orange-800 px-4 rounded-sm'
            >
              Edit
            </button>
          </div>
        </div>

        {/* Edit User Modal */}
        {isEditUserModalOpen && (
          <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
              <h3 className="text-lg font-medium leading-6 text-gray-900 p-6">Edit User</h3>
              <form
                onSubmit={handleSubmit}
                className="p-6"
              >
                <div className="mt-4">
                  <input
                    name="username"
                    type="text"
                    defaultValue={user.username}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mt-4">
                  <input
                    name="email"
                    type="email"
                    defaultValue={user.email}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mt-4">
                  <select
                    name="role"
                    defaultValue={user.role}
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
                    defaultValue={user.terminal}
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

        {/* Second column - Description and Bio */}
        <div className="flex flex-col ">
          <div className="mb-4 rounded shadow-md">
            <h2 className="text-xl p-4 font-semibold text-gray-800">Description</h2>
            <p className="mt-2 px-4 text-gray-600">
              {user.description ? user.description : 'No description available.'}
            </p>
          </div>
          <div className="mb-4 rounded shadow-md">
            <h2 className="text-xl p-4 font-semibold text-gray-800">Bio</h2>
            <p className="mt-2 px-4 text-gray-600">
              {user.bio ? user.bio : 'No bio available.'}
            </p>
          </div>
        </div>

        {/* Third column - Concerns and Goals */}
        <div className="flex flex-col justify-between">
          <div className="mb-4 rounded shadow-md">
            <h2 className="text-xl p-4 font-semibold text-gray-800">Concerns</h2>
            <p className="mt-2 px-4 text-gray-600">
              {user.concerns ? user.concerns : 'No concerns listed.'}
            </p>
          </div>
          <div className="mb-4 rounded shadow-md">
            <h2 className="text-xl p-4 font-semibold text-gray-800">Goals</h2>
            <p className="mt-2 px-4 text-gray-600">
              {user.goals ? user.goals : 'No goals listed.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
