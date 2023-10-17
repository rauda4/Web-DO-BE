const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwtDecode = require('jwt-decode');

class TransactionController {
  static async getTransaction(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
      jwt.verify(token, process.env.ACCES_TOKEN, (err) => {
        if (err) {
          return res.status(403).json({ auth: false, msg: 'forbidden' });
        }
      });
    } else {
      const userAccount = jwtDecode(token);
      const user_id = userAccount.id;
      const users = await prisma.transaction.findMany({
        where: { user_id },
        select: {
          transaction_id: true,
          transaction_type: true,
          transaction_description: true,
          transaction_amount: true,
          created_on: true,
          user_id: false
        }
      });
      return res.status(200).json({ msg: 'Authorized', data: users });
    }
  }
  static async balance(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
      jwt.verify(token, process.env.ACCES_TOKEN, (err) => {
        if (err) {
          return res.status(403).json({ auth: false, msg: 'forbidden' });
        }
      });
    } else {
      const userAccount = jwtDecode(token);
      const user_id = userAccount.id;
      const aggregations = await prisma.topUp.aggregate({
        where: { user_id },
        _sum: {
          top_up_amount: true
        }
      });

      return res.status(200).json({
        msg: 'Get Balance Succes',
        balance: aggregations._sum.top_up_amount
      });
    }
  }

  static async topUp(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
      jwt.verify(token, process.env.ACCES_TOKEN, (err) => {
        if (err) {
          return res.status(403).json({ auth: false, msg: 'forbidden' });
        }
      });
    } else {
      const userAccount = jwtDecode(token);
      const id = userAccount.id;
      const { top_up_amount } = req.body;
      const parseTopUp = parseInt(top_up_amount);
      const topUp = await prisma.topUp.create({
        data: { top_up_amount: parseTopUp, user_id: id }
      });

      // create transaction history
      // const count = await prisma.transaction.count();
      // const transaction = await prisma.transaction.create({
      //   data: {
      //     transaction_id: 'INV-' + count
      //   }
      // });
      return res.status(200).json({
        msg: 'Top Up Balance Succes',
        data: { balance: top_up_amount }
      });
    }
  }

  static async getDatatopUp(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
      jwt.verify(token, process.env.ACCES_TOKEN, (err) => {
        if (err) {
          return res.status(403).json({ auth: false, msg: 'forbidden' });
        }
      });
    } else {
      const userAccount = jwtDecode(token);
      const user_id = userAccount.id;
      const topUp = await prisma.topUp.findMany({
        where: { user_id },
        select: {
          top_up_amount: true
        }
      });
      const aggregations = await prisma.topUp.aggregate({
        where: { user_id },
        _sum: {
          top_up_amount: true
        }
      });

      return res.status(200).json({
        msg: 'Get Balance Succes',
        data: topUp,
        balance: aggregations._sum.top_up_amount
      });
    }
  }
}

module.exports = TransactionController;
