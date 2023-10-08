const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwtDecode = require('jwt-decode');

class UserController {
  static async getUsers(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
      jwt.verify(token, process.env.ACCES_TOKEN, (err, user) => {
        if (err) {
          return res.status(403).json({ auth: false, msg: 'forbidden' });
        }
        req.user = user;
        next();
      });
    } else {
      const users = await prisma.user.findMany({
        select: {
          username: true,
          email: true
        }
      });
      return res.status(200).json({ msg: 'Authorized', data: users });
    }
  }

  static async selectUser(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
      jwt.verify(token, process.env.ACCES_TOKEN, (err, user) => {
        if (err) {
          return res.status(403).json({ auth: false, msg: 'forbidden' });
        }
        req.user = user;
        next();
      });
    } else {
      const userAccount = jwtDecode(token);
      const id = userAccount.id;
      const users = await prisma.user.findUnique({
        where: { id },
        select: {
          username: true,
          email: true,
          balance: true
        }
      });
      return res.status(200).json({ msg: 'Authorized', data: users });
    }
  }

  static async updateUsers(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
      jwt.verify(token, process.env.ACCES_TOKEN, (err, user) => {
        if (err) {
          return res.status(403).json({ auth: false, msg: 'forbidden' });
        }
        req.user = user;
        next();
      });
    } else {
      const userAccount = jwtDecode(token);
      const id = userAccount.id;
      const { username } = req.body;
      const user = await prisma.user.findUnique({ where: { id } });
      const updateData = await prisma.user.update({
        where: { id },
        data: {
          username,
          email: user.email
        }
      });
      return res
        .status(200)
        .json({ msg: 'succes update profile', data: updateData });
    }
  }
}

module.exports = UserController;
