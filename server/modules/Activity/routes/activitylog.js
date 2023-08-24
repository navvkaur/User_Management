const express = require('express');
const router = express.Router();
const tokenverification = require('../../../middleware/jwt')

const activitylogController = require('../Controllers/ActivityLogControllers.js')

router.get('/getActivity',tokenverification.decodeToken,activitylogController.getlogs)

module.exports = router;
