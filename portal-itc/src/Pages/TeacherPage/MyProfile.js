// import { useEffect, useState, useContext } from 'react';
// import AuthContext from '../../context/AuthContext';
// import { getAllUsers, updateUserProfile } from '../../services/userService';

// const MyProfile = () => {
//   const { user } = useContext(AuthContext);
//   const [users, setUsers] = useState([]);
//   const [isEditUserModalOpen, setEditUserModalOpen] = useState(false);
//   const [profile, setProfile] = useState({});

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const data = await getAllUsers(user.token);
//         setUsers(data);
//       } catch (error) {
//         console.error('Failed to fetch users:', error);
//       }
//     };

//     fetchUsers();
//   }, [user.token]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const updateData = {
//       username: e.target.username.value,
//       email: e.target.email.value,
//       role: e.target.role.value,
//       terminal: e.target.terminal.value,
//     };
//     try {
//       await updateUserProfile(user.token, updateData);
//       setEditUserModalOpen(false);
//       alert('User successfully updated!');
//     } catch (error) {
//       console.error('Failed to update user:', error);
//     }
//   };


//   return (
//     <div className="max-w-4xl  p-6 w-full bg-white rounded-lg shadow-lg">
//       {/* Column layout */}
//       <div className="grid grid-cols-1 mx-[20%] lg:grid-cols-3 gap-6">
//         {/* First column - Profile picture and user details */}
//         <div className="flex flex-col items-center">
//           {/* Profile Picture with First Letter of Username */}
//           <div className="bg-gray-300 text-white w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold">
//             {user.username.charAt(0)}
//           </div>
//           {/* User Details */}
//           <div className="mt-4 text-center">
//             <p className="text-lg font-semibold">ID: {user.id}</p>
//             <p className="text-lg font-semibold">Name: {user.username}</p>
//             <p className="text-md text-gray-600">Role: {user.role}</p>
//             <p className="text-md text-gray-600">Email: {user.email}</p>
//             <button
//               onClick={() => setEditUserModalOpen(true)}
//               className='w-full bg-itccolor py-2 text-white hover:bg-orange-800 px-4 rounded-sm'
//             >
//               Edit
//             </button>
//           </div>
//         </div>

//         {/* Edit User Modal */}
//         {isEditUserModalOpen && (
//           <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
//             <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
//               <h3 className="text-lg font-medium leading-6 text-gray-900 p-6">Edit User</h3>
//               <form
//                 onSubmit={handleSubmit}
//                 className="p-6"
//               >
//                 <div className="mt-4">
//                   <input
//                     name="username"
//                     type="text"
//                     defaultValue={user.username}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-md"
//                   />
//                 </div>
//                 <div className="mt-4">
//                   <input
//                     name="email"
//                     type="email"
//                     defaultValue={user.email}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-md"
//                   />
//                 </div>
//                 <div className="mt-4">
//                   <select
//                     name="role"
//                     defaultValue={user.role}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-md"
//                   >
//                     <option value="admin">Admin</option>
//                     <option value="user">User</option>
//                   </select>
//                 </div>
//                 <div className="mt-4">
//                   <input
//                     name="terminal"
//                     type="text"
//                     defaultValue={user.terminal}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-md"
//                   />
//                 </div>
//                 <div className="flex justify-end mt-6 space-x-4">
//                   <button
//                     type="button"
//                     onClick={() => setEditUserModalOpen(false)}
//                     className="px-4 py-2 bg-gray-200 rounded-md"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-itccolor text-white rounded-md"
//                   >
//                     Save
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Second column - Description and Bio */}
//         <div className="flex flex-col ">
//           <div className="mb-4 rounded shadow-md">
//             <h2 className="text-xl p-4 font-semibold text-gray-800">Description</h2>
//             <p className="mt-2 px-4 text-gray-600">
//               {user.description ? user.description : 'No description available.'}
//             </p>
//           </div>
//           <div className="mb-4 rounded shadow-md">
//             <h2 className="text-xl p-4 font-semibold text-gray-800">Bio</h2>
//             <p className="mt-2 px-4 text-gray-600">
//               {user.bio ? user.bio : 'No bio available.'}
//             </p>
//           </div>
//         </div>

//         {/* Third column - Concerns and Goals */}
//         <div className="flex flex-col justify-between">
//           <div className="mb-4 rounded shadow-md">
//             <h2 className="text-xl p-4 font-semibold text-gray-800">Concerns</h2>
//             <p className="mt-2 px-4 text-gray-600">
//               {user.concerns ? user.concerns : 'No concerns listed.'}
//             </p>
//           </div>
//           <div className="mb-4 rounded shadow-md">
//             <h2 className="text-xl p-4 font-semibold text-gray-800">Goals</h2>
//             <p className="mt-2 px-4 text-gray-600">
//               {user.goals ? user.goals : 'No goals listed.'}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyProfile;



import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { updateTeacher, getTeacherByID } from '../../services/teacherService';

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    // firstName: '',
    // lastName: '',
    // middleName: '',
    gender: '',
    dateOfBirth: '',
    nationality: 'Nigerian',
    stateOfOrigin: '',
    lgaOfOrigin: '',
    address: '',
    phoneNumber: '',
    email: '',
    staffNumber: '',
    higherQualification: '',
    employmentType: '',
    bankname: '',
    accountNumber: '',
    NIN: '',
    section: '',
    passportPhoto: '',
    bloodGroup: '',
    genotype: '',
    guardian: {
      fullName: '',
      relationship: '',
      phoneNumber: '',
      address: '',
      email: ''
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileRes = await getTeacherByID(user._id);
        const profileData = profileRes.data;
        
        setProfile(profileData);
        setFormData({
          // firstName: profileData.firstName || '',
          // lastName: profileData.lastName || '',
          // middleName: profileData.middleName || '',
          gender: profileData.gender || '',
          dateOfBirth: profileData.dateOfBirth || '',
          nationality: profileData.nationality || 'Nigerian',
          stateOfOrigin: profileData.stateOfOrigin || '',
          lgaOfOrigin: profileData.lgaOfOrigin || '',
          address: profileData.address || '',
          phoneNumber: profileData.phoneNumber || '',
          email: profileData.email || '',
          staffNumber: profileData.staffNumber || '',
          higherQualification: profileData.higherQualification || '',
          employmentType: profileData.employmentType || '',
          bankname: profileData.bankname || '',
          accountNumber: profileData.accountNumber || '',
          NIN: profileData.NIN || '',
          section: profileData.section || '',
          passportPhoto: profileData.passportPhoto || '',
          bloodGroup: profileData.bloodGroup || '',
          genotype: profileData.genotype || '',
          guardian: profileData.guardian || {
            fullName: '',
            relationship: '',
            phoneNumber: '',
            address: '',
            email: ''
          },
          emergencyContact: profileData.emergencyContact || {
            name: '',
            phone: '',
            relationship: ''
          }
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please try again later.');
      }
    };

    fetchProfile();
  }, [user._id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
    setError('');
  };

  const validateForm = () => {
    const requiredFields = [
      // 'firstName',
      // 'lastName',
      'gender',
      'dateOfBirth',
      'nationality',
      'stateOfOrigin',
      'phoneNumber',
      'email',
      'staffNumber',
      'higherQualification',
      'employmentType',
      'bankname',
      'accountNumber',
      'NIN',
      'bloodGroup',
      'genotype',
      'guardian.fullName',
      'guardian.relationship',
      'guardian.phoneNumber',
      'emergencyContact.name',
      'emergencyContact.phone',
      'emergencyContact.relationship'
    ];
    
    const missingFields = requiredFields.filter(field => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return !formData[parent]?.[child];
      }
      return !formData[field];
    });
    
    return missingFields.length > 0 ? missingFields : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const missingFields = validateForm();
      if (missingFields) {
        setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }
      
      await updateTeacher(profile._id, formData);
      const profileRes = await getTeacherByID(user._id);
      const profileData = profileRes.data;
      
      setProfile(profileData);
      setIsModalOpen(false);
      setError('');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please check your inputs and try again.');
    }
  };

  if (error && !isModalOpen) {
    return (
      <div className="text-red-500 text-center py-6 font-medium animate-pulse">
        {error}
        <button
          onClick={() => setError('')}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Clear Error
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-10">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium">Loading profile...</p>
      </div>
    );
  }

  const DetailRow = ({ label, value }) => (
    <div className="flex justify-between border-b border-dotted border-gray-300 py-1 text-sm text-gray-700">
      <span className="font-medium">{label}</span>
      <span className="text-right max-w-[60%] break-words">{value || 'N/A'}</span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 bg-white shadow-xl rounded-xl animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">My Profile</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
        >
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-24 sm:w-36 h-24 sm:h-36 rounded-full overflow-hidden shadow-md border-4 border-blue-200 hover:scale-105 transition-transform duration-300">
            <img
              src={profile.passportPhoto || '/default-avatar.jpg'}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm">
            {profile.gender}, {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'N/A'}
          </p>
          <p className="text-gray-500 text-xs sm:text-sm">
            Staff No: {profile.staffNumber}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-itccolor mb-2 border-b pb-1">Personal Info</h3>
            <DetailRow label="First Name" value={profile.firstName} />
            <DetailRow label="Middle Name" value={profile.middleName} />
            <DetailRow label="Last Name" value={profile.lastName} />
            <DetailRow label="Gender" value={profile.gender} />
            <DetailRow label="Date of Birth" value={profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'N/A'} />
            <DetailRow label="Nationality" value={profile.nationality} />
            <DetailRow label="State of Origin" value={profile.stateOfOrigin} />
            <DetailRow label="LGA" value={profile.lgaOfOrigin} />
            <DetailRow label="Address" value={profile.address} />
            <DetailRow label="Phone" value={profile.phoneNumber} />
            <DetailRow label="Email" value={profile.email} />
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-itccolor mb-2 border-b pb-1">Professional Info</h3>
            <DetailRow label="Staff Number" value={profile.staffNumber} />
            <DetailRow label="Higher Qualification" value={profile.higherQualification} />
            <DetailRow label="Employment Type" value={profile.employmentType} />
            <DetailRow label="Section" value={profile.section} />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-itccolor mb-2 border-b pb-1">Bank Details</h3>
            <DetailRow label="Bank Name" value={profile.bankname} />
            <DetailRow label="Account Number" value={profile.accountNumber} />
            <DetailRow label="NIN" value={profile.NIN} />
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-itccolor mb-2 border-b pb-1">Health Info</h3>
            <DetailRow label="Blood Group" value={profile.bloodGroup} />
            <DetailRow label="Genotype" value={profile.genotype} />
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-itccolor mb-2 border-b pb-1">Emergency Contact</h3>
            {profile.emergencyContact ? (
              <>
                <DetailRow label="Name" value={profile.emergencyContact.name} />
                <DetailRow label="Relationship" value={profile.emergencyContact.relationship} />
                <DetailRow label="Phone" value={profile.emergencyContact.phone} />
              </>
            ) : (
              <p className="text-xs sm:text-sm text-gray-500 italic">No emergency contact provided.</p>
            )}
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-itccolor mb-2 border-b pb-1">Guardian Info</h3>
            {profile.guardian ? (
              <>
                <DetailRow label="Name" value={profile.guardian.fullName} />
                <DetailRow label="Relationship" value={profile.guardian.relationship} />
                <DetailRow label="Phone" value={profile.guardian.phoneNumber} />
                <DetailRow label="Email" value={profile.guardian.email} />
              </>
            ) : (
              <p className="text-xs sm:text-sm text-gray-500 italic">No guardian info provided.</p>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[85vh] overflow-y-auto relative">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setError('');
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-lg sm:text-xl font-bold mb-4">Edit Profile</h2>
            {error && (
              <div className="text-red-500 text-xs sm:text-sm mb-3 sm:mb-4 flex items-center">
                <span>{error}</span>
                <button
                  onClick={() => setError('')}
                  className="ml-2 sm:ml-4 text-blue-500 underline text-xs sm:text-sm"
                >
                  Clear
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Personal Info */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2">Personal Info</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">First Name*</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                      <input
                        type="text"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Last Name*</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                        required
                      />
                    </div> */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Gender*</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Date of Birth*</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nationality*</label>
                      <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">State of Origin*</label>
                      <input
                        type="text"
                        name="stateOfOrigin"
                        value={formData.stateOfOrigin}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">LGA of Origin</label>
                      <input
                        type="text"
                        name="lgaOfOrigin"
                        value={formData.lgaOfOrigin}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email*</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Info */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2">Professional Info</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Staff Number*</label>
                      <input
                        type="text"
                        name="staffNumber"
                        value={formData.staffNumber}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Higher Qualification*</label>
                      <input
                        type="text"
                        name="higherQualification"
                        value={formData.higherQualification}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Employment Type*</label>
                      <select
                        name="employmentType"
                        value={formData.employmentType}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                        required
                      >
                        <option value="">Select Employment Type</option>
                        <option value="fullTime">Full Time</option>
                        <option value="partTime">Part Time</option>
                        <option value="contract">Contract</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Section</label>
                      <input
                        type="text"
                        name="section"
                        value={formData.section}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2">Bank Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Bank Name*</label>
                      <input
                        type="text"
                        name="bankname"
                        value={formData.bankname}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Account Number*</label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">NIN*</label>
                      <input
                        type="text"
                        name="NIN"
                        value={formData.NIN}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Health Info */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2">Health Info</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Blood Group*</label>
                      <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                        required
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Genotype*</label>
                      <select
                        name="genotype"
                        value={formData.genotype}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                        required
                      >
                        <option value="">Select Genotype</option>
                        <option value="AA">AA</option>
                        <option value="AS">AS</option>
                        <option value="SS">SS</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Guardian and Emergency Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2">Guardian Info</h3>
                    <div className="space-y-2 sm:space-y-3">
                      <input
                        type="text"
                        placeholder="Full Name*"
                        value={formData.guardian?.fullName || ''}
                        onChange={(e) => handleNestedInputChange('guardian', 'fullName', e.target.value)}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Relationship*"
                        value={formData.guardian?.relationship || ''}
                        onChange={(e) => handleNestedInputChange('guardian', 'relationship', e.target.value)}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Phone Number*"
                        value={formData.guardian?.phoneNumber || ''}
                        onChange={(e) => handleNestedInputChange('guardian', 'phoneNumber', e.target.value)}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Address"
                        value={formData.guardian?.address || ''}
                        onChange={(e) => handleNestedInputChange('guardian', 'address', e.target.value)}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={formData.guardian?.email || ''}
                        onChange={(e) => handleNestedInputChange('guardian', 'email', e.target.value)}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2">Emergency Contact</h3>
                    <div className="space-y-2 sm:space-y-3">
                      <input
                        type="text"
                        placeholder="Name*"
                        value={formData.emergencyContact?.name || ''}
                        onChange={(e) => handleNestedInputChange('emergencyContact', 'name', e.target.value)}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Relationship*"
                        value={formData.emergencyContact?.relationship || ''}
                        onChange={(e) => handleNestedInputChange('emergencyContact', 'relationship', e.target.value)}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Phone*"
                        value={formData.emergencyContact?.phone || ''}
                        onChange={(e) => handleNestedInputChange('emergencyContact', 'phone', e.target.value)}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end mt-4 sm:mt-6 gap-2 sm:gap-4">
                <button 
                  type="submit"
                  className="bg-green-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-green-600 transition text-xs sm:text-sm"
                >
                  Save Changes
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setError('');
                  }} 
                  className="bg-red-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-red-600 transition text-xs sm:text-sm"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
