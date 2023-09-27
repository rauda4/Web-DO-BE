const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const { uploadImage } = require('../utils/cloudinary');

class pruductController {
  static async createImage(req, res) {
    const upload = await uploadImage(req.file.path);
    await fs.unlinkSync(req.file.path);
    const imageUrl = upload.url;
    console.log(imageUrl);
    res.send('upload sukses');
  }
  static async createDataProduct(req, res) {
    try {
      const { tittle, description, price } = req.body;
      const upload = await uploadImage(req.file.path);
      await fs.unlinkSync(req.file.path);
      const imageUrl = upload.url;
      const parsedprice = parseInt(price);
      const products = await prisma.product.create({
        data: {
          tittle,
          description,
          price: parsedprice,
          thumbnail: imageUrl,
        },
      });

      if (!tittle) {
        return res.status(400).json({
          result: 'failed',
          message: 'tittle cannot be empty !',
        });
      }
      if (!description) {
        return res.status(400).json({
          result: 'failed',
          message: 'description cannot be empty !',
        });
      }
      if (!price) {
        return res.status(400).json({
          result: 'failed',
          message: 'price cannot be empty !',
        });
      }
      res.status(200).json({
        message: 'succes create data !',
        data: products,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error.message });
    }
  }

  static async getProduct(req, res) {
    const { tittle } = req.query;
    try {
      const products = await prisma.product.findMany({
        where: { tittle: { startsWith: tittle } },
        orderBy: {
          tittle: 'asc',
        },
      });
      if (!products) {
        return res.status(400).json({
          result: 'error',
          msg: 'cannot find product',
        });
      }

      // total data
      const resultCount = await prisma.product.count();

      res.status(200).json({
        result: 'succes find product',
        total_data: resultCount,
        payload: products,
      });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }

  static async getProductById(req, res) {
    try {
      const { id } = req.params;
      const products = await prisma.product.findUnique({ where: { id } });
      if (!products) {
        return res.status(400).json({
          result: 'product not found',
        });
      }
      res.status(200).json({
        message: `succes find product id ${id}`,
        data: products,
      });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }

  static async GetProductByQuery(req, res) {
    try {
      const { key } = req.params;
      const products = await prisma.product.findMany({
        where: {
          tittle: {
            startsWith: key,
          },
        },
        orderBy: {
          tittle: 'asc',
        },
      });
      if (!products) {
        return res.status(400).json({
          result: 'product not found',
        });
      }
      res.status(200).json({
        message: `succes find product id ${key}`,
        data: products,
      });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }

  static async updateDataProduct(req, res) {
    try {
      const { id } = req.params;
      const { tittle, thumbnail, description, price } = req.body;
      const updateData = await prisma.product.update({
        where: { id },
        data: {
          tittle,
          thumbnail,
          description,
          price,
        },
      });
      res.status(200).json({
        result: 'succes',
        message: `succes updated product with id ${id}`,
        data: updateData,
      });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await prisma.product.delete({ where: { id } });
      if (!product) {
        res.status(400).json({ msg: 'cannot delete product !' });
      }
      res.status(200).json({ msg: 'succes delete product!' });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }
}

module.exports = pruductController;
