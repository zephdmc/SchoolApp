// const express = require("express");
// const router = express.Router();
// const resultController = require("../../src/controller/examRecord");

// router.post("/", resultController.saveResults);
// router.get("/", resultController.getResults);
// router.put("/:id/approve", resultController.approveResult);

// module.exports = router;




const express = require("express");
const router = express.Router();
const {saveResults, getStudentResults, updateResultsStatus, getResultsByClassAndSubject, getPendingResults, updateSingleResultStatus, getStudentPendingResults, getAllStudentsInClass } = require("../controller/examRecord");

router.get("/", getResultsByClassAndSubject);
router.post("/save", saveResults);
router.get('/student/:studentId/class/:classId/term/:termId', getStudentResults);
// Route to fetch students with pending results
router.get('/results/pending', getPendingResults);
// Route to update results status
router.put('/update-status', updateResultsStatus);
// Add this to your routes (examRecord.js)
router.put('/update-single-status', updateSingleResultStatus);
// router.post('/fetch', getStudentResult);
// Add these new routes
router.get('/student/:studentId/pending/term/:termId/class/:classId', getStudentPendingResults);
router.put('/update-result-status', updateSingleResultStatus);
// router.put('/results/update-status', updateResultsStatus);
// Add to your routes (examRecord.js)
router.get('/class/:classId/students', getAllStudentsInClass);
// Route to update status of all results in a term and class

module.exports = router;