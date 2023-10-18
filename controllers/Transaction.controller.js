const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwtDecode = require('jwt-decode');

class TransactionController {
  static async getTransactionHistory(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
      jwt.verify(token, process.env.ACCES_TOKEN, () => {
        return res.status(403).json({ auth: false, msg: 'forbidden' });
      });
    } else {
      const userAccount = jwtDecode(token);
      const user_id = userAccount.id;
      const { page = 1, limit = 5 } = req.query;
      const skip = (page - 1) * limit;
      const count = await prisma.transactionHistory.count({
        where: { user_id }
      });
      const users = await prisma.transactionHistory.findMany({
        where: { user_id },
        take: parseInt(limit || 5),
        skip: skip,
        select: {
          transaction_id: true,
          transaction_type: true,
          transaction_description: true,
          transaction_amount: true,
          created_on: true,
          user_id: false
        }
      });
      return res.status(200).json({
        msg: 'Authorized',
        total: count,
        current_page: page - 0,
        current_limit: limit,
        data: users
      });
    }
  }

  static async balance(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
      jwt.verify(token, process.env.ACCES_TOKEN, () => {
        return res.status(403).json({ auth: false, msg: 'forbidden' });
      });
    } else {
      const userAccount = jwtDecode(token);
      const user_id = userAccount.id;

      // check total amount top up
      const topup = await prisma.topUp.aggregate({
        where: { user_id },
        _sum: {
          top_up_amount: true
        }
      });
      const totalTopUp = topup._sum.top_up_amount;

      // check total amount transaction
      const payment = await prisma.transaction.aggregate({
        where: { user_id },
        _sum: { transaction_amount: true }
      });
      const totalPayment = payment._sum.transaction_amount;

      return res.status(200).json({
        msg: 'Get Balance Succes',
        balance: totalTopUp - totalPayment
      });
    }
  }

  static async getTopUp(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
      jwt.verify(token, process.env.ACCES_TOKEN, () => {
        return res.status(403).json({ auth: false, msg: 'forbidden' });
      });
    } else {
      const userAccount = jwtDecode(token);
      const user_id = userAccount.id;
      const count = await prisma.topUp.count({
        where: { user_id }
      });
      const data = await prisma.topUp.findMany({ where: { user_id } });

      // count total top up
      const balance = await prisma.topUp.aggregate({
        where: { user_id },
        _sum: {
          top_up_amount: true
        }
      });

      return res.status(200).json({
        msg: 'Succes',
        total_data: count,
        total_amount_topup: balance._sum.top_up_amount || 0,
        data
      });
    }
  }

  static async getDataTransaction(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
      jwt.verify(token, process.env.ACCES_TOKEN, () => {
        return res.status(403).json({ auth: false, msg: 'forbidden' });
      });
    } else {
      const userAccount = jwtDecode(token);
      const user_id = userAccount.id;
      const count = await prisma.transactionHistory.count({
        where: { user_id }
      });
      const data = await prisma.transaction.findMany({
        where: { user_id }
      });

      // count total balance transaction
      const balance = await prisma.transaction.aggregate({
        where: { user_id },
        _sum: { transaction_amount: true }
      });

      return res.status(200).json({
        msg: 'Top Up Balance Succes',
        total_amount_transaction: balance._sum.transaction_amount || 0,
        total_data: count,
        data
      });
    }
  }

  static async topUp(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
      jwt.verify(token, process.env.ACCES_TOKEN, () => {
        return res.status(403).json({ auth: false, msg: 'forbidden' });
      });
    } else {
      const userAccount = jwtDecode(token);
      const user_id = userAccount.id;
      const { top_up_amount } = req.body;
      const parseTopUp = parseInt(top_up_amount);
      await prisma.topUp.create({
        data: { top_up_amount: parseTopUp, user_id }
      });

      // create transaction history
      const count = Math.floor(Math.random() * 100000);
      await prisma.transactionHistory.create({
        data: {
          user_id,
          transaction_id: 'INV-' + count,
          transaction_type: 'TOP UP',
          transaction_description: 'Top Up balance',
          transaction_amount: parseInt(top_up_amount),
          created_on: Date()
        }
      });
      return res.status(200).json({
        msg: 'Top Up Balance Succes',
        data: { balance: top_up_amount }
      });
    }
  }

  static async transaction(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
      jwt.verify(token, process.env.ACCES_TOKEN, () => {
        return res.status(403).json({ auth: false, msg: 'forbidden' });
      });
    } else {
      const userAccount = jwtDecode(token);
      const user_id = userAccount.id;
      const { product_code } = req.body;
      const count = Math.floor(Math.random() * 100000);

      // find product based product code
      const product = await prisma.product.findUnique({
        where: { product_code }
      });

      // check total amount top up
      const topup = await prisma.topUp.aggregate({
        where: { user_id },
        _sum: {
          top_up_amount: true
        }
      });
      const totalTopUp = topup._sum.top_up_amount;

      // check total amount transaction
      const payment = await prisma.transaction.aggregate({
        where: { user_id },
        _sum: { transaction_amount: true }
      });
      const totalPayment = payment._sum.transaction_amount;

      const totalBalance = totalTopUp - totalPayment;
      const priceProduct = product.product_price;

      // handler check balance before transaction
      if (totalBalance < priceProduct)
        return res.status(404).json({
          result: 'Failed',
          message: 'Saldo Not Enough'
        });

      try {
        // create new transaction
        const transaction = await prisma.transaction.create({
          data: {
            product_code,
            transaction_id: 'INV-' + count,
            user_id,
            product_name: product.product_name,
            transaction_type: 'PAYMENT',
            transaction_amount: product.product_price,
            created_on: Date()
          }
        });
        // create transaction history
        await prisma.transactionHistory.create({
          data: {
            user_id,
            transaction_id: 'INV-' + count,
            transaction_type: 'PAYMENT',
            transaction_description: product.product_name,
            transaction_amount: product.product_price,
            created_on: Date()
          }
        });

        res.status(200).json({
          result: 'succes',
          message: 'Transaction Succes',
          data: transaction
        });
      } catch (error) {
        res.status(500).json({ msg: error });
      }
    }
  }
}

module.exports = TransactionController;
