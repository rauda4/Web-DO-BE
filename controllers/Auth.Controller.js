const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
  static async createUser(req, res) {
    const { username, password, email } = req.body;

    // check if any fields empty
    if (!email || !username || !password) {
      return res.status(404).json({
        result: 'Failed',
        message: 'Please add all fields'
      });
    }

    try {
      const hashPw = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: {
          username,
          password: hashPw,
          email,
          balance: 0
        }
      });
      res.status(200).json({
        message: 'Succes create data',
        data: user
      });
    } catch (error) {
      if (error.code === 'P2002') {
        res.status(404).json({ message: 'User already doest exist' });
      } else {
        res.status(500).json({ msg: error });
        console.log(error);
      }
    }
  }

  static async login(req, res) {
    try {
      // validation body
      const { email, password } = req.body;
      if (!email)
        return res.status(401).json({ msg: 'Email cannot be empty!' });
      if (!password)
        return res.status(401).json({ msg: 'Password cannot be empty!' });

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(401).json({ msg: 'User not found' });
      // validation password with jwt
      const compare = await bcrypt.compare(password, user.password);
      if (!compare)
        return res
          .status(401)
          .json({ auth: false, msg: "Password doesn't match" });
      // handling login with jwt based id and username and email
      const payload = {
        id: user.id,
        username: user.username,
        email: user.email
      };
      return jwt.sign(payload, process.env.ACCES_TOKEN, (err, token) => {
        res.status(200).json({ auth: true, status: 'authorized', token });
      });
    } catch (error) {
      res.send(error.message);
    }
  }
}

module.exports = AuthController;
