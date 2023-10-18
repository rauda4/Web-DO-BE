const TransactionController = require('../controllers/Transaction.controller');

const Router = require('express').Router();

Router.get('/transaction/history', TransactionController.getTransactionHistory);
Router.get('/balance', TransactionController.balance);
Router.get('/topup', TransactionController.getTopUp);
Router.post('/topup', TransactionController.topUp);
Router.get('/transaction', TransactionController.getDataTransaction);
Router.post('/transaction', TransactionController.transaction);

module.exports = Router;
