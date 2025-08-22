// // server/services/cronJobs.js
const cron = require('node-cron');
const paymentController = require('../controller/paymentController');

// // Skip in test environment
// if (process.env.NODE_ENV === 'test') return;

// // Daily at 2 AM
// cron.schedule('0 2 * * *', async () => {
//   console.log('[CRON] Processing overdue payments...');
//   try {
//     await paymentController.processOverduePayments({}, {
//       json: data => console.log('[CRON] Result:', data),
//       status: () => ({ json: () => {} })
//     });
//   } catch (error) {
//     console.error('[CRON] Failed:', error);
//   }
// });

// console.log('Cron jobs initialized');


// // Daily at 1:40 PM
// cron.schedule('40 13 * * *', async () => {


    
//     console.log('[CRON] Processing overdue payments...');
//     try {
//       await paymentController.processOverduePayments({}, {
//         json: data => console.log('[CRON] Result:', data),
//         status: () => ({ json: () => {} })
//       });
//     } catch (error) {
//       console.error('[CRON] Failed:', error);
//     }
//   });
  


// Immediate test run
(async () => {
    console.log('[TEST RUN] Processing overdue payments now...');
    try {
      await paymentController.processOverduePayments({}, {
        json: data => console.log('[TEST RUN] Result:', data),
        status: () => ({ json: () => {} })
      });
    } catch (error) {
      console.error('[TEST RUN] Failed:', error);
    }
  })();
  
  // Keep original schedule
  cron.schedule('40 13 * * *', async () => {
    console.log('[CRON] Processing overdue payments...');
    try {
      await paymentController.processOverduePayments({}, {
        json: data => console.log('[CRON] Result:', data),
        status: () => ({ json: () => {} })
      });
    } catch (error) {
      console.error('[CRON] Failed:', error);
    }
  });