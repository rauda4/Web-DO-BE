const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const { uploadImage } = require('../utils/cloudinary');

class pruductController {
  static async createImage(req, res) {
    const imagePath = req.file.path;
    const upload = await uploadImage(imagePath);
    await fs.unlinkSync(imagePath);
    const imageUrl = upload.url;
    res.send('upload sukses');
  }
  static async createDataProduct(req, res) {
    try {
      const {
        product_name,
        product_description,
        product_price,
        product_stock
      } = req.body;
      // handle upload image
      const imagePath = req.file.path;
      const upload = await uploadImage(imagePath);
      await fs.unlinkSync(imagePath);
      const imageUrl = upload.url;
      // handle convert string to int
      const parsedStock = parseInt(product_stock);
      const parsedPrice = parseInt(product_price);
      // handle count data for product code
      const countId = await prisma.product.count();
      const products = await prisma.product.create({
        data: {
          product_code: 'PL2' + countId,
          product_name,
          product_description,
          product_price: parsedPrice,
          product_icon: imageUrl,
          product_stock: parsedStock
        }
      });

      if (!product_name) {
        return res.status(400).json({
          result: 'failed',
          message: 'Name cannot be empty !'
        });
      }
      if (!product_description) {
        return res.status(400).json({
          result: 'failed',
          message: 'description cannot be empty !'
        });
      }
      if (!product_price) {
        return res.status(400).json({
          result: 'failed',
          message: 'price cannot be empty !'
        });
      }
      if (!product_stock) {
        return res.status(400).json({
          result: 'failed',
          message: 'stock cannot be empty !'
        });
      }
      res.status(200).json({
        message: 'succes create data !',
        data: products
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error.message });
    }
  }

  static async getProduct(req, res) {
    const { product, description, page = 1, limit = 5 } = req.query;
    try {
      const skip = (page - 1) * limit;
      const products = await prisma.product.findMany({
        take: parseInt(limit || 5),
        skip: skip,
        where: {
          product_name: { contains: product },
          product_description: { contains: description }
        },
        orderBy: {
          product_code: 'asc'
        }
      });
      if (!products) {
        return res.status(400).json({
          result: 'error',
          msg: 'cannot find product'
        });
      }

      // total data
      const resultCount = await prisma.product.count();

      res.status(200).json({
        result: 'succes find product',
        total_data: resultCount,
        current_page: page - 0,
        current_limit: limit,
        payload: products
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
          result: 'product not found'
        });
      }
      res.status(200).json({
        message: `succes find product id ${id}`,
        data: products
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
            startsWith: key
          }
        },
        orderBy: {
          tittle: 'asc'
        }
      });
      if (!products) {
        return res.status(400).json({
          result: 'product not found'
        });
      }
      res.status(200).json({
        message: `succes find product id ${key}`,
        data: products
      });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  }

  static async updateDataProduct(req, res) {
    try {
      const { id } = req.params;
      const {
        product_name,
        product_description,
        product_price,
        product_stock
      } = req.body;
      // handle upload image
      const imagePath = req.file.path;
      const upload = await uploadImage(imagePath);
      await fs.unlinkSync(imagePath);
      const imageUrl = upload.url;
      // handle convert string to int
      const parsedStock = parseInt(product_stock);
      const parsedPrice = parseInt(product_price);
      // handle count data for product code
      const updateData = await prisma.product.update({
        where: { id },
        data: {
          product_name,
          product_icon: imageUrl,
          product_description,
          product_price: parsedPrice,
          product_stock: parsedStock
        }
      });
      res.status(200).json({
        result: 'succes',
        message: `succes updated product with id ${id}`,
        data: updateData
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
