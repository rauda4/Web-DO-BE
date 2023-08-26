const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
  static async createUser(req, res) {
    try {
      const { username, password, email } = req.body;
      const hashPw = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: {
          username,
          password: hashPw,
          email,
        },
      });
      //jika body tidak di isi
      if (!email || !username) {
        return res.status(404).json({
          result: 'Failed',
          message: 'username or email cannot be empty',
        });
      }
      if (!password) {
        return res.status(404).json({
          result: 'Failed',
          message: 'password cannot be empty',
        });
      }
      res.status(200).json({
        message: 'succes create data',
        data: user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error.message });
    }
  }

  static async login(req, res) {
    try {
      // validation body
      const { username, password } = req.body;
      if (!username)
        return res.status(401).json({ msg: 'username cannot be empty!' });
      if (!password)
        return res.status(401).json({ msg: 'password cannot be empty!' });

      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) return res.status(401).json({ msg: 'user not found' });
      // validation password with jwt
      const compare = await bcrypt.compare(password, user.password);
      if (!compare)
        return res
          .status(401)
          .json({ auth: false, msg: "password doesn't match" });
      // handling login with jwt based id and username
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.ACCES_TOKEN,
        (err, token) => {
          res.status(200).json({ auth: true, status: 'authorized', token });
        },
      );
    } catch (error) {
      res.send(error.message);
    }
  }
}

module.exports = AuthController;
