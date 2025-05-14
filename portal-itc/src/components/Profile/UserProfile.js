// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../hooks/useAuth';

// const UserProfile = () => {
//   const { user, loading, error } = useAuth();
//   const [editing, setEditing] = useState(false);
//   const [profileData, setProfileData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//   });

//   useEffect(() => {
//     if (user) {
//       setProfileData({
//         name: user.name,
//         email: user.email,
//         phone: user.phone || '',
//         address: user.address || '',
//       });
//     }
//   }, [user]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProfileData({ ...profileData, [name]: value });
//   };

//   const handleSave = () => {
//     // API call to save updated profile data
//     setEditing(false);
//   };

//   if (loading) return <p>Loading profile...</p>;

//   if (error) return <p className="text-red-500">Error: {error}</p>;

//   return (
//     <div className="max-w-xl mx-auto mt-8 p-4 border rounded-lg shadow-md">
//       <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
//       {editing ? (
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Name</label>
//             <input
//               type="text"
//               name="name"
//               value={profileData.name}
//               onChange={handleInputChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={profileData.email}
//               onChange={handleInputChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Phone</label>
//             <input
//               type="text"
//               name="phone"
//               value={profileData.phone}
//               onChange={handleInputChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Address</label>
//             <textarea
//               name="address"
//               value={profileData.address}
//               onChange={handleInputChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
//             />
//           </div>
//           <div className="flex justify-end space-x-4">
//             <button
//               onClick={() => setEditing(false)}
//               className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSave}
//               className="px-4 py-2 bg-blue-500 text-white rounded-md"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           <div>
//             <p className="text-sm font-medium text-gray-500">Name</p>
//             <p className="text-lg font-semibold">{profileData.name}</p>
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-500">Email</p>
//             <p className="text-lg font-semibold">{profileData.email}</p>
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-500">Phone</p>
//             <p className="text-lg font-semibold">{profileData.phone}</p>
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-500">Address</p>
//             <p className="text-lg font-semibold">{profileData.address}</p>
//           </div>
//           <div className="flex justify-end">
//             <button
//               onClick={() => setEditing(true)}
//               className="px-4 py-2 bg-blue-500 text-white rounded-md"
//             >
//               Edit Profile
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserProfile;


import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const UserProfile = () => {
  const { user, loading, error } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.username, // Assuming the user object has `username` instead of `name`
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSave = () => {
    // API call to save updated profile data
    setEditing(false);
  };

  if (loading) return <p>Loading profile...</p>;

  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-xl mx-auto mt-8 p-4 border rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={profileData.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-lg font-semibold">{profileData.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-lg font-semibold">{profileData.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Phone</p>
            <p className="text-lg font-semibold">{profileData.phone}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Address</p>
            <p className="text-lg font-semibold">{profileData.address}</p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
