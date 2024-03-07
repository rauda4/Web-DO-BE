const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();
const midtransApi = require('../utils/midtrans');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');

class paymentController {
  static async createPaymentDiamond(req, res) {
    try {
      const { price, gameId, serverId, payment, nameDiamond } = req.body;
      const random = Math.floor(Math.random() * 100000);
      const parsedPrice = parseInt(price);
      const parsedGameId = parseInt(gameId);
      const parsedServerId = parseInt(serverId);

      const parameter = {
        transaction_details: {
          order_id: 'INV-' + random,
          gross_amount: price
        },
        item_detailss: {
          first_name: gameId,
          last_name: serverId,
          payment: payment,
          name: nameDiamond
        }
      };
      const transaction = await midtransApi
        .snapMidtrans()
        .createTransaction(parameter);

      // create new data on database based data midtrans
      const data = await prisma.paymentDiamond.create({
        data: {
          order_id: 'INV-' + random,
          price: parsedPrice,
          gameId: parsedGameId,
          serverId: parsedServerId,
          payment,
          nameDiamond,
          created_on: Date()
        }
      });

      // update new stock after purchased
      // 1. get find diamond
      const diamonds = await prisma.diamond.findUnique({
        where: { diamond_name: nameDiamond }
      });
      const total_stock = diamonds.diamond_stock - 1;

      // 2. update new stock
      await prisma.diamond.update({
        where: { diamond_name: nameDiamond },
        data: {
          diamond_stock: total_stock
        }
      });

      res.status(200).json({
        message: 'succes',
        total_stock,
        transaction,
        data
      });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }

  static async getPaymentDiamond(req, res) {
    try {
      const data = await prisma.paymentDiamond.findMany({
        orderBy: {
          created_on: 'asc'
        }
      });
      if (!data) {
        return res.status(400).json({
          result: 'error',
          message: 'cannot find data'
        });
      }

      // total data
      const resultCount = await prisma.paymentDiamond.count();

      res.status(200).json({
        resutlt: 'succes find data payment diamond',
        total_data: resultCount,
        data: data
      });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }

  static async deletePaymentData(req, res) {
    try {
      const { id } = req.params;
      const data = await prisma.paymentDiamond.delete({ where: { id } });
      if (!data) {
        res.status(400).json({ msg: 'cannot delete data !' });
      }
      res.status(200).json({ msg: 'succes delete data!' });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }

  // payment product <<<<<<<<<<<

  static async createPaymentProduct(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
      jwt.verify(token, process.env.ACCES_TOKEN, () => {
        return res.status(403).json({ auth: false, msg: 'forbidden' });
      });
    } else {
      const userAccount = jwtDecode(token);
      const user_id = userAccount.id;
      const random = Math.floor(Math.random() * 100000); // add math random for order id
      const { bank, product_code } = req.body;
      const product = await prisma.product.findUnique({
        where: { product_code }
      });

      // config paramater for response midtrans
      const parameter = {
        payment_type: 'bank_transfer',
        bank_transfer: {
          bank
        },
        transaction_details: {
          order_id: 'INV-' + random,
          gross_amount: product.product_price
        },
        product_code,
        nama: product.product_name
      };

      // get response midtrans using paramater
      const chargeResponse = await midtransApi.coreMidtrans().charge(parameter);

      const payment_detail = chargeResponse.va_numbers.reduce((item) => item);

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
      const totalPaymentTransaction = payment._sum.transaction_amount;

      const totalBalance = totalTopUp - totalPaymentTransaction;
      const productPrice = product.product_price; // get product price

      const data = await prisma.paymentProduct.create({
        data: {
          order_id: 'INV-' + random,
          product_code,
          product_name: product.product_name,
          response_midtrans: JSON.stringify(chargeResponse)
        }
      });

      const productStock = await prisma.product.findUnique({
        where: { product_code }
      });
      const total_stock = productStock.product_stock - 1;

      await prisma.product.update({
        where: { product_code },
        data: {
          product_stock: total_stock
        }
      });

      // handler check balance before transaction
      if (totalBalance < productPrice)
        return res.status(301).json({
          result: 'Failed',
          message: 'Saldo Not Enough'
        });

      try {
        // create new transaction
        const transaction = await prisma.transaction.create({
          data: {
            product_code, // get from req.body
            transaction_id: 'INV-' + random,
            user_id, // get from token decode after login
            product_name: product.product_name, // get from result filter product
            transaction_type: 'PAYMENT',
            transaction_amount: product.product_price, // get from result filter product
            created_on: Date()
          }
        });

        // create transaction history
        await prisma.transactionHistory.create({
          data: {
            user_id,
            transaction_id: 'INV-' + random,
            transaction_type: 'PAYMENT',
            transaction_description: product.product_name, // get from result filter product
            transaction_amount: product.product_price, // get from result filter product
            created_on: Date()
          }
        });

        res.json({
          status: true,
          msg: 'berhasil order',
          total_stock,
          transaction,
          payment_detail,
          data
        });
      } catch (error) {
        res.status(500).json({ msg: error });
      }
    }
  }

  static async getPaymentOrder(req, res) {
    try {
      const data = await prisma.paymentProduct.findMany();
      const response = data.map((item) => {
        return {
          order_id: item.order_id,
          tiket_id: item.tiket_id,
          nama: item.nama,
          response: JSON.parse(item.response_midtrans)
        };
      });
      if (data) {
        return res.status(200).json({ status: 'succes', response });
      }
    } catch (error) {
      res.status(500).json({ status: failed, message: error.message });
    }
  }

  static async statusOrder(req, res) {
    try {
      const { order_id } = req.params;
      const statusResponse = await midtransApi
        .coreMidtrans()
        .transaction.status(order_id);
      const responseMidtrans = JSON.stringify(statusResponse);

      const updateData = await prisma.paymentProduct.update({
        where: { order_id },
        data: { response_midtrans: responseMidtrans }
      });

      res.status(200).json({ status: true, responseMidtrans });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  }
}

module.exports = paymentController;
