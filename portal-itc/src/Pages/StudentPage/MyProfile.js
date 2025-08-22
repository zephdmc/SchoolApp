

import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { getStudentById, updateStudent } from '../../services/studentService';
import { getAllClasses } from '../../services/ClassService';

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    gender: '',
    dateOfBirth: '',
    nationality: 'Nigerian',
    stateOfOrigin: '',
    lgaOfOrigin: '',
    address: '',
    phoneNumber: '',
    email: '',
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
    const fetchProfileAndClasses = async () => {
      try {
        const [profileRes, classRes] = await Promise.all([
          getStudentById(user._id),
          getAllClasses(),
        ]);
        
        const profileData = profileRes.data.data;
        setProfile(profileData);
        setFormData({
          gender: profileData.gender || '',
          dateOfBirth: profileData.dateOfBirth || '',
          nationality: profileData.nationality || 'Nigerian',
          stateOfOrigin: profileData.stateOfOrigin || '',
          lgaOfOrigin: profileData.lgaOfOrigin || '',
          address: profileData.address || '',
          phoneNumber: profileData.phoneNumber || '',
          email: profileData.email || '',
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
        setClasses(Array.isArray(classRes) ? classRes : classRes.data || []);
      } catch (err) {
        console.error('Error fetching profile or classes:', err);
        setError('Failed to load profile. Please try again later.');
      }
    };

    fetchProfileAndClasses();
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
      'gender',
      'dateOfBirth',
      'nationality',
      'stateOfOrigin',
      'phoneNumber',
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
      await updateStudent(profile._id, formData);
      const profileRes = await getStudentById(user._id);
      const profileData = profileRes.data.data;
      setProfile(profileData);
      setFormData({
        gender: profileData.gender || '',
        dateOfBirth: profileData.dateOfBirth || '',
        nationality: profileData.nationality || 'Nigerian',
        stateOfOrigin: profileData.stateOfOrigin || '',
        lgaOfOrigin: profileData.lgaOfOrigin || '',
        address: profileData.address || '',
        phoneNumber: profileData.phoneNumber || '',
        email: profileData.email || '',
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

  const {
    firstName,
    lastName,
    gender,
    dateOfBirth,
    nationality,
    stateOfOrigin,
    lgaOfOrigin,
    address,
    phoneNumber,
    email,
    admissionNumber,
    class: studentClassId,
    section,
    guardian,
    admissionDate,
    passportPhoto,
    bloodGroup,
    genotype,
    emergencyContact,
  } = profile;

  const className = Array.isArray(classes)
    ? classes.find(cls => cls._id === studentClassId)?.name || 'Class Not Found'
    : 'Class Not Found';

  const DetailRow = ({ label, value }) => (
    <div className="flex justify-between border-b border-dotted border-gray-300 py-1 text-sm text-gray-700">
      <span className="font-medium">{label}</span>
      <span className="text-right max-w-[60%] break-words">{value}</span>
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
              src={passportPhoto || '/default-avatar.jpg'}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {firstName} {lastName}
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm">
            {gender}, {new Date(dateOfBirth).toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-itccolor mb-2 border-b pb-1">Personal Info</h3>
            <DetailRow label="Nationality" value={nationality} />
            <DetailRow label="State of Origin" value={stateOfOrigin} />
            <DetailRow label="LGA" value={lgaOfOrigin} />
            <DetailRow label="Address" value={address} />
            <DetailRow label="Phone" value={phoneNumber} />
            <DetailRow label="Email" value={email} />
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-itccolor mb-2 border-b pb-1">Academic Info</h3>
            <DetailRow label="Admission No" value={admissionNumber} />
            <DetailRow label="Class" value={className} />
            <DetailRow label="Section" value={section} />
            <DetailRow label="Admission Date" value={admissionDate ? new Date(admissionDate).toLocaleDateString() : 'N/A'} />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-itccolor mb-2 border-b pb-1">Health Info</h3>
            <DetailRow label="Blood Group" value={bloodGroup} />
            <DetailRow label="Genotype" value={genotype} />
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-itccolor mb-2 border-b pb-1">Emergency Contact</h3>
            {emergencyContact ? (
              <>
                <DetailRow label="Name" value={emergencyContact.name} />
                <DetailRow label="Relationship" value={emergencyContact.relationship} />
                <DetailRow label="Phone" value={emergencyContact.phone} />
              </>
            ) : (
              <p className="text-xs sm:text-sm text-gray-500 italic">No emergency contact provided.</p>
            )}
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-itccolor mb-2 border-b pb-1">Guardian Info</h3>
            {guardian ? (
              <>
                <DetailRow label="Name" value={guardian.fullName} />
                <DetailRow label="Relationship" value={guardian.relationship} />
                <DetailRow label="Phone" value={guardian.phoneNumber} />
                <DetailRow label="Email" value={guardian.email} />
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
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Gender</label>
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
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
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
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nationality</label>
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
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">State of Origin</label>
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
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Phone Number</label>
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
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                      />
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

                {/* Health Info */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2">Health Info</h3>
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Blood Group</label>
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
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Genotype</label>
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
                        placeholder="Full Name"
                        value={formData.guardian?.fullName || ''}
                        onChange={(e) => handleNestedInputChange('guardian', 'fullName', e.target.value)}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Relationship"
                        value={formData.guardian?.relationship || ''}
                        onChange={(e) => handleNestedInputChange('guardian', 'relationship', e.target.value)}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Phone Number"
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
                        placeholder="Name"
                        value={formData.emergencyContact?.name || ''}
                        onChange={(e) => handleNestedInputChange('emergencyContact', 'name', e.target.value)}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Relationship"
                        value={formData.emergencyContact?.relationship || ''}
                        onChange={(e) => handleNestedInputChange('emergencyContact', 'relationship', e.target.value)}
                        className="w-full border rounded px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Phone"
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