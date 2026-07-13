const express = require('express');
const router = express.Router();
const dbController = require('../controllers/db.controller');

router.post('/sync', dbController.syncDatabase);
router.get('/all', dbController.getAll);
router.get('/:collection', dbController.getCollection);
router.post('/:collection', dbController.createDocument);
router.put('/:collection/:id', dbController.updateDocument);
router.delete('/:collection/:id', dbController.deleteDocument);

module.exports = router;
