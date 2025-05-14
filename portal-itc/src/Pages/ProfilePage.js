import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../services/userService';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({});
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getUserProfile(user.token);
      setProfile(data);
      setUsername(data.username);
      setEmail(data.email);
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUserProfile(user.token, { username, email });
  };

  return (
    <div>
      <h1>Profile</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default ProfilePage;
