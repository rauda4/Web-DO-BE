const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

class diamondController {
  static async createDataDiamond(req, res) {
    try {
      const { diamond_name, diamond_price, diamond_stock } = req.body;
      const parsedPrice = parseInt(diamond_price);
      const parsedStock = parseInt(diamond_stock);
      const diamond = await prisma.diamond.create({
        data: {
          diamond_name,
          diamond_price: parsedPrice,
          diamond_stock: parsedStock
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
    const { diamond_name } = req.query;
    try {
      const diamonds = await prisma.diamond.findMany({
        where: { diamond_name: { startsWith: diamond_name } },
        orderBy: {
          diamond_price: 'asc'
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
      const { diamond_name, diamond_price, diamond_stock } = req.body;
      const parsedPrice = parseInt(diamond_price);
      const parsedStock = parseInt(diamond_stock);
      const updateData = await prisma.diamond.update({
        where: { diamond_id: id },
        data: {
          diamond_name,
          diamond_price: parsedPrice,
          diamond_stock: parsedStock
        }
      });

      res.status(200).json({
        result: 'succes',
        message: `succes updated diamond`,
        data: updateData
      });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }

  static async updateDataStock(req, res) {
    try {
      const { name } = req.body;
      const diamonds = await prisma.diamond.findUnique({ where: { name } });
      const totalStock = diamonds.stock - 1;
      const updateData = await prisma.diamond.update({
        where: { name },
        data: {
          stock: total_stock
        }
      });

      res.status(200).json({
        result: 'succes',
        message: `succes updated stock diamond`,
        diamondStock: totalStock,
        data: updateData
      });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }

  static async deleteDiamond(req, res) {
    try {
      const { id } = req.params;
      const diamonds = await prisma.diamond.delete({
        where: { diamond_id: id }
      });
      if (!diamonds) {
        res.status(400).json({ msg: 'cannot delete data !' });
      }
      res.status(200).json({ msg: 'succes delete diamond!' });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }
}

module.exports = diamondController;
