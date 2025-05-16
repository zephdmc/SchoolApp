const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    deleteUser,
    updateEnroll,
    updateEnrollTeacher,
    getStudentsWithoutEnroll,
    getTeachersWithoutEnroll,

} = require('../controller/userController');

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
// Route to update Enroll
router.put('/users/:userId/enroll', updateEnroll);
router.put('/users/:userId/enrollTeacher', updateEnrollTeacher);
// Route to get all students where Enroll is null
router.get('/students/enroll-null',  protect, authorize('sadmin'), getStudentsWithoutEnroll);
router.get('/teachers/enroll-null',  protect, authorize('sadmin'), getTeachersWithoutEnroll);
router.get('/all', protect, authorize('sadmin'), getAllUsers);
router.delete('/:id', protect, authorize('sadmin'), deleteUser);

module.exports = router;


