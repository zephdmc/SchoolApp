import { useEffect, useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { getStudentById } from '../../services/studentService';
import { getAllClasses } from '../../services/ClassService';

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileAndClasses = async () => {
      try {
        const [profileRes, classRes] = await Promise.all([
          getStudentById(user._id),
          getAllClasses(),
        ]);
        setProfile(profileRes.data);
        setClasses(Array.isArray(classRes) ? classRes : classRes.data || []);
      } catch (err) {
        console.error('Error fetching profile or classes:', err);
        setError('Failed to load profile. Please try again later.');
      }
    };

    fetchProfileAndClasses();
  }, [user._id]);

  if (error) {
    return (
      <div className="text-red-500 text-center py-6 font-medium animate-pulse">
        {error}
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
    <div className="max-w-7xl mx-auto px-6 py-10 bg-white shadow-xl rounded-xl animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Profile Picture and Name */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-36 h-36 rounded-full overflow-hidden shadow-md border-4 border-blue-200 hover:scale-105 transition-transform duration-300">
            <img
              src={passportPhoto || '/default-avatar.jpg'}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {firstName} {lastName}
          </h2>
          <p className="text-gray-500 text-sm">
            {gender}, {new Date(dateOfBirth).toLocaleDateString()}
          </p>
        </div>

        {/* Personal and Academic Info */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-itccolor mb-2 border-b pb-1">Personal Info</h3>
            <DetailRow label="Nationality" value={nationality} />
            <DetailRow label="State of Origin" value={stateOfOrigin} />
            <DetailRow label="LGA" value={lgaOfOrigin} />
            <DetailRow label="Address" value={address} />
            <DetailRow label="Phone" value={phoneNumber} />
            <DetailRow label="Email" value={email} />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-itccolor mb-2 border-b pb-1">Academic Info</h3>
            <DetailRow label="Admission No" value={admissionNumber} />
            <DetailRow label="Class" value={className} />
            <DetailRow label="Section" value={section} />
            <DetailRow label="Admission Date" value={admissionDate ? new Date(admissionDate).toLocaleDateString() : 'N/A'} />
          </div>
        </div>

        {/* Health, Emergency, Guardian Info */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-itccolor mb-2 border-b pb-1">Health Info</h3>
            <DetailRow label="Blood Group" value={bloodGroup} />
            <DetailRow label="Genotype" value={genotype} />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-itccolor mb-2 border-b pb-1">Emergency Contact</h3>
            {emergencyContact ? (
              <>
                <DetailRow label="Name" value={emergencyContact.name} />
                <DetailRow label="Relationship" value={emergencyContact.relationship} />
                <DetailRow label="Phone" value={emergencyContact.phone} />
              </>
            ) : (
              <p className="text-sm text-gray-500 italic">No emergency contact provided.</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-itccolor mb-2 border-b pb-1">Guardian Info</h3>
            {guardian ? (
              <>
                <DetailRow label="Name" value={guardian.name} />
                <DetailRow label="Relationship" value={guardian.relationship} />
                <DetailRow label="Phone" value={guardian.phone} />
                <DetailRow label="Email" value={guardian.email} />
              </>
            ) : (
              <p className="text-sm text-gray-500 italic">No guardian info provided.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
