// const express = require('express');
// const router = express.Router();
// // const { fetchStudentsOrResults, submitResults, updateResults } = require('../controller/resultController');
// // const {submitResults, updateResults } = require('../controller/resultController');

// // // router.get('/fetch', fetchStudentsOrResults);
// // router.post('/submit', submitResults);
// // router.put('/update', updateResults);


// const { submitResults, updateResults } = require('../controller/resultController');
// console.log(submitResults);  // Check if submitResults is being correctly imported

// router.post('/submit', submitResults);
// router.put('/update', updateResults);

// module.exports = router;


const express = require('express');
const router = express.Router();
const resultController = require('../controller/ResultConttroller');

console.log("Loaded Controller:", resultController);  // Debugging

router.get('/fetch', resultController.fetchStudentsOrResults);
router.post('/submit', resultController.submitResults);
router.put('/update', resultController.updateResults);


module.exports = router;


