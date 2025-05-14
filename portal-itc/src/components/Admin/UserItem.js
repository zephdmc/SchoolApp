import { useState } from 'react';
import { deleteUser } from '../../api/userApi';

const UserItem = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteUser(user.id);
      window.location.reload(); // Reload the page to reflect the deleted user
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <li className="flex items-center justify-between p-4 bg-gray-100 rounded shadow">
      <div>
        <p className="text-lg font-semibold text-gray-800">{user.name}</p>
        <p className="text-sm text-gray-600">{user.email}</p>
      </div>
      <div className="flex items-center space-x-4">
        <button
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-500 focus:ring-opacity-50"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </li>
  );
};

export default UserItem;
