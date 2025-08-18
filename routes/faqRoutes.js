const express = require('express');
const router = express.Router();
const { getFaqs, createFaq } = require('../controller/faqController');

// You might want to add authentication middleware here later
// const { protect, admin } = require('../middleware/authMiddleware');

// Define routes
router.route('/')
  .get(getFaqs)       // GET /faq -> fetches all FAQs
  .post(createFaq);   // POST /faq -> creates a new FAQ
  // .post(protect, admin, createFaq); // Example with auth middleware

// Add routes for updating/deleting specific FAQs if needed
// router.route('/:id')
//   .put(updateFaq)    // PUT /faq/:id
//   .delete(deleteFaq); // DELETE /faq/:id

module.exports = router; 