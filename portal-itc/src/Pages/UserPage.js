import { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { getAllUsers, deleteUser } from '../services/userService';

const UserPage = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const data = await getAllUsers(user.token);
//       setUsers(data);
//     };

//     fetchUsers();
//   }, [user]);

  const handleDelete = async (userId) => {
    await deleteUser(user.token, userId);
    setUsers(users.filter((u) => u._id !== userId));
  };

  return (
    <div>
      <h1>User</h1>
      {/* <ul>
        {users.map((u) => (
          <li key={u._id}>
            {u.username} ({u.email}) <button onClick={() => handleDelete(u._id)}>Delete</button>
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default UserPage;
