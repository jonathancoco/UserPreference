var express = require('express');
var router = express.Router();
var userPreferences = require(rootdir+'/controller/userPreference')

router.get('/userPreference', function(req, res, next) {

        userPreferences.getUserPreference(req, res, next)
});

router.post('/userPreference', function(req, res, next) {

        userPreferences.setUserPreference(req, res, next)
});

module.exports = router;
