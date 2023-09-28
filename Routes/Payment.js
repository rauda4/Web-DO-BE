const paymentController = require('../controllers/Payment.controller');
const Router = require('express').Router();

Router.post('/process-transaction', paymentController.createPaymentDiamond);
Router.get('/', paymentController.getPaymentDiamond);
Router.delete('/:id', paymentController.deletePaymentData);

module.exports = Router;
