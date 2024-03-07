const paymentController = require('../controllers/Payment.controller');
const Router = require('express').Router();
const { createPaymentProduct } = require('../controllers/Payment.controller');

Router.post(
  '/payment/process-transaction',
  paymentController.createPaymentDiamond
);
Router.get('/payment/diamond', paymentController.getPaymentDiamond);
Router.delete('/payment/diamond/:id', paymentController.deletePaymentData);
Router.post('/payment/product-transaction', createPaymentProduct);
Router.get('/payment/order', paymentController.getPaymentOrder);
Router.get('/status/order/:order_id', paymentController.statusOrder);

module.exports = Router;
