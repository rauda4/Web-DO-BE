const diagnosisController = require('../controllers/Diagnosis.controller');
const Router = require('express').Router();

Router.get('/', diagnosisController.getData);

module.exports = Router;
