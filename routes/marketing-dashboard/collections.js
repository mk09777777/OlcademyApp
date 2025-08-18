const express = require('express');
const {getAllCollections, getActiveCollections, createCollection, updateCollection, deleteCollection, clickCounts, getClicksByTimeframe, getCollectionBySlug} = require('../../controller/marketing-dashboard/collectionController')
const upload = require('../../config/multerConfig');

const router = express.Router();

router.get('/', getAllCollections);
router.post('/', upload, createCollection);  // Add upload middleware here

router.post('/collection-click/:_id', clickCounts)   // add a new click entry with current date
router.get('/:id/clicks', getClicksByTimeframe)

router.get('/active', getActiveCollections);
router.get('/by-slug/:slug', getCollectionBySlug);  // Add this new route

router.put('/:id', upload, updateCollection);
router.delete('/:id', deleteCollection);

module.exports = router;
