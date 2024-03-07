const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class diagnosisController {
  static async getData(req, res) {
    try {
      const { gejala } = req.body;
      if (!gejala) {
        return res
          .status(404)
          .json({ status: 'failed', msg: 'tidak ada data' });
      }
      if (gejala === 'batuk') {
        return  res.status(201).json({ status: 'succes', yes: 2, no: 0 });
      }
      if (gejala === 'panas') {
        return res.status(201).json({ status: 'succes', yes: 0, no: 2 });
      }
      res.status(200).json({ status: 'succes' });
    } catch (error) {
      res.status(501).json({ msg: error.message });
    }
  }
}

module.exports = diagnosisController;
