const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const midtransClient = require('midtrans-client');
require('dotenv').config();

class paymentController {
  static async createPaymentDiamond(req, res) {
    try {
      const { price, gameId, serverId, payment, nameDiamond } = req.body;
      const countId = await prisma.paymentDiamond.count();
      const parsedPrice = parseInt(price);
      const parsedGameId = parseInt(gameId);
      const parsedServerId = parseInt(serverId);

      // config midtrans
      const snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.SERVER_KEY,
        clientKey: process.env.CLIENT_KEY
      });

      const parameter = {
        transaction_details: {
          order_id: countId + 11,
          gross_amount: price
        },
        item_detailss: {
          first_name: gameId,
          last_name: serverId,
          payment: payment,
          name: nameDiamond
        }
      };
      const transaction = await snap.createTransaction(parameter);

      // create new data on database based data midtrans
      const data = await prisma.paymentDiamond.create({
        data: {
          order_id: countId + 11,
          price: parsedPrice,
          gameId: parsedGameId,
          serverId: parsedServerId,
          payment,
          nameDiamond
        }
      });

      // update new stock after purchased
      // 1. get find diamond
      const diamonds = await prisma.diamond.findUnique({
        where: { name: nameDiamond }
      });
      const total_stock = diamonds.stock - 1;

      // 2. update new stock
      await prisma.diamond.update({
        where: { name: nameDiamond },
        data: {
          stock: total_stock
        }
      });

      res.status(200).json({
        message: 'succes',
        total_stock: total_stock,
        transaction,
        data
      });
      console.log(total_stock);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }

  static async getPaymentDiamond(req, res) {
    try {
      const data = await prisma.paymentDiamond.findMany({
        orderBy: {
          order_id: 'asc'
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
}

module.exports = paymentController;
