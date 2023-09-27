const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const midtransClient = require('midtrans-client');
require('dotenv').config();

class diamondController {
  static async createDataDiamond(req, res) {
    try {
      const { name, price } = req.body;
      const parsedPrice = parseInt(price);
      const diamond = await prisma.diamond.create({
        data: {
          name,
          price: parsedPrice
        }
      });
      if (!diamond)
        return res.status(404).json({
          result: 'Failed',
          messege: 'failed create data'
        });

      res.status(200).json({
        message: 'berhasil membuat data user',
        data: diamond
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error.message });
    }
  }

  // static async getDiamond({ request }) {
  //   try {
  //   } catch (error) {}
  // }
  static async getDiamond(req, res) {
    const { name } = req.query;
    try {
      const diamonds = await prisma.diamond.findMany({
        where: { name: { startsWith: name } },
        orderBy: {
          price: 'asc'
        }
      });
      if (!diamonds) {
        return res.status(400).json({
          result: 'error',
          message: 'cannot find diamond'
        });
      }

      // total data
      const resultCount = await prisma.diamond.count();

      res.status(200).json({
        resutlt: 'succes find diamond',
        total_data: resultCount,
        data: diamonds
      });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }

  static async getDiamondById(req, res) {
    try {
      const { id } = req.params;
      const diamonds = await prisma.diamond.findUnique({ where: { id } });
      if (!diamonds) {
        return res.status(400).json({
          result: 'diamond not found'
        });
      }
      res.status(200).json({
        message: `succes find diamond id ${id}`,
        data: diamonds
      });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }

  static async updateData(req, res) {
    try {
      const { id } = req.params;
      const { name, price } = req.body;
      const updateData = await prisma.diamond.update({
        where: { id },
        data: {
          name,
          price
        }
      });
      res.status(200).json({
        result: 'succes',
        message: `succes updated diamond with id ${id}`,
        data: updateData
      });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }

  static async deleteDiamond(req, res) {
    try {
      const { id } = req.params;
      const diamonds = await prisma.diamond.delete({ where: { id } });
      if (!diamonds) {
        res.status(400).json({ msg: 'cannot delete data !' });
      }
      res.status(200).json({ msg: 'succes delete diamond!' });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }

  static async paymentDiamond(req, res) {
    try {
      const snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.SERVER_KEY,
        clientKey: process.env.CLIENT_KEY
      });

      const { order_id, price, zoneId, serverId } = req.body;
      const parameter = {
        transaction_details: {
          order_id: order_id,
          gross_amount: price
        },
        customer_details: {
          first_name: zoneId,
          last_name: serverId
        }
      };
      snap.createTransaction(parameter).then((transaction) => {
        res.status(200).json({ message: 'succes', transaction });
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = diamondController;
