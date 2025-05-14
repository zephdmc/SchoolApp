// import { Route, Redirect } from 'react-router-dom';
// import { useContext } from 'react';
// import AuthContext from './context/AuthContext';

// const PrivateRoute = ({ component: Component, ...rest }) => {
//   const { user } = useContext(AuthContext);

//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         user ? <Component {...props} /> : <Redirect to="/login" />
//       }
//     />
//   );
// };

// export default PrivateRoute;


// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const PrivateRoute = ({ children, isAuthenticated }) => {
//   return isAuthenticated ? children : <Navigate to="/login" />;
// };

// export default PrivateRoute;


import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth'; // Adjust the import path

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>; // Or a loading spinner
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
