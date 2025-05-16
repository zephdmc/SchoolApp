// const User = require('../models/User');
// const jwtConfig = require('../config/jwtConfig');

// // Generate Token
// const generateToken = (id) => {
//     return jwt.sign({ id }, jwtConfig.secret, {
//         expiresIn: '30d',
//     });
// };

// const getUserProfile = async (req, res) => {
//     const user = await User.findById(req.user._id).select('-password');
   
//     res.json(user);
// };

// const updateUserProfile = async (req, res) => {
//     const user = await User.findById(req.user._id);
//     if (user) {
//         user.username = req.body.username || user.username;
//         user.email = req.body.email || user.email;
//         if (req.body.password) {
//             user.password = req.body.password;
//         }
//         const updatedUser = await user.save();
//         res.json({
//                 _id: updatedUser._id,
//                 username: updatedUser.username,
//                 email: updatedUser.email,
//                 role: updatedUser.role,
//                 token: generateToken(updatedUser._id),
//             });
//         } else {
//             res.status(404).json({ message: 'User not found' });
//         }
//     };
    
//     // Admin functionality to get all users
//     const getAllUsers = async (req, res) => {
//         const users = await User.find().select('-password');
//         console.log(users, "face")
//         res.json(users);
//     };
    
//     // Admin functionality to delete a user
//     const deleteUser = async (req, res) => {
//         const user = await User.findById(req.params.id);
    
//         if (user) {
//             await user.remove();
//             res.json({ message: 'User removed' });
//         } else {
//             res.status(404).json({ message: 'User not found' });
//         }
//     };
    
//     module.exports = { getUserProfile, updateUserProfile, getAllUsers, deleteUser };
    





// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const jwtConfig = require('../config/jwtConfig');

// // Generate Token
// const generateToken = (id) => {
//     return jwt.sign({ id }, jwtConfig.secret, {
//         expiresIn: '30d',
//     });
// };

// // Get User Profile
// const getUserProfile = async (req, res) => {
//     const user = await User.findById(req.user._id).select('-password');
//     res.json(user);
// };

// // Update User Profile
// const updateUserProfile = async (req, res) => {
//     const user = await User.findById(req.user._id);
//     if (user) {
//         user.username = req.body.username || user.username;
//         user.email = req.body.email || user.email;
//         if (req.body.password) {
//             user.password = req.body.password;
//         }
//         const updatedUser = await user.save();
//         res.json({
//             _id: updatedUser._id,
//             username: updatedUser.username,
//             email: updatedUser.email,
//             role: updatedUser.role,
//             token: generateToken(updatedUser._id),
//         });
//     } else {
//         res.status(404).json({ message: 'User not found' });
//     }
// };

// // Admin: Get All Users
// const getAllUsers = async (req, res) => {
//     const users = await User.find().select('-password');
//     res.json(users);
// };

// // Admin: Delete User
// const deleteUser = async (req, res) => {
//     const user = await User.findById(req.params.id);
//     if (user) {
//         await user.remove();
//         res.json({ message: 'User removed' });
//     } else {
//         res.status(404).json({ message: 'User not found' });
//     }
// };

// module.exports = { getUserProfile, updateUserProfile, getAllUsers, deleteUser };



const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const User = require('../models/User');
const jwtConfig = require('../config/jwtConfig'); // Adjust the path as necessary

// Generate Token
const generateToken = (id) => {
    return jwt.sign({ id }, jwtConfig.secret, {
        expiresIn: '30d',
    });
};

// Get User Profile
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
};




// Update User Profile
const updateUserProfile = async (req, res) => {
    console.log('nogodo', req.user._id)

    if (!req.user || !req.user._id) {
        return res.status(400).json({ message: 'User ID is missing or invalid' });
    }

    const user = await User.findById(req.user._id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// Admin: Get All Users
const getAllUsers = async (req, res) => {
    const users = await User.find().select('-password');
    res.json(users);
};

// Update only the Enroll field
const updateEnroll = async (req, res) => {
    try {
      const { userId } = req.params; // Get user ID from params
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update Enroll only if it is null
      if (user.Enroll === null) {
        user.Enroll = '1';
        await user.save();
        return res.status(200).json({ message: 'Enroll updated successfully', user });
      }
  
      return res.status(400).json({ message: 'Enroll is already set' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };


  // Update only the Enroll field for teacher
const updateEnrollTeacher = async (req, res) => {
  try {
    const { userId } = req.params; // Get user ID from params
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update Enroll only if it is null
    if (user.Enroll === null) {
      user.Enroll = '1';
      await user.save();
      return res.status(200).json({ message: 'Enroll updated successfully', user });
    }

    return res.status(400).json({ message: 'Enroll is already set' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


  // Get all users where role is 'student' and Enroll is null
const getStudentsWithoutEnroll = async (req, res) => {
    try {
      const students = await User.find({ role: 'student', Enroll: null });
  
      if (students.length === 0) {
        return res.status(404).json({ message: 'No students found without Enroll' });
      }
  console.log(students, "student without enroll")
      res.status(200).json({ message: 'Students fetched successfully', students });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  const getTeachersWithoutEnroll = async (req, res) => {
    try {
      const teachers = await User.find({ role: 'teacher', Enroll: null });
  
      if (teachers.length === 0) {
        return res.status(404).json({ message: 'No teacher found without Enroll' });
      }
  console.log(teachers, "teacher without enroll")
      res.status(200).json({ message: 'Teachers fetched successfully', teachers });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };


// // Admin: Delete User
// const deleteUser = async (req, res) => {
//     const user = await User.findById(req.params.id);
//     if (user) {
//         await user.remove();
//         res.json({ message: 'User removed' });
//     } else {
//         res.status(404).json({ message: 'User not found' });
//     }
// };

// Admin: Delete User
// const deleteUser = async (req, res) => {
//     const user = await User.findById(req.params.id);
//     if (user) {
//         await user.deleteOne(); // Use deleteOne() instead of remove()
//         res.json({ message: 'User removed' });
//     } else {
//         res.status(404).json({ message: 'User not found' });
//     }
// };


const deleteUser = async (req, res) => {
    console.log(params.userId, 'opay')
    const email = req.params.userId;
    const user = await User.find(email);
    if (user) {
        await user.deleteOne(); // Use deleteOne() instead of remove()
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { getUserProfile, updateUserProfile, getAllUsers, updateEnrollTeacher, deleteUser, updateEnroll, getStudentsWithoutEnroll, getTeachersWithoutEnroll};


