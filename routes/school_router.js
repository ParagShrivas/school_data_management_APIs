const express = require('express');
const router = express.Router();
const { addSchool, listSchools } = require('../controller/school_control');

router.post('/addSchool', addSchool);
router.get('/listSchools', listSchools);

module.exports = router;
