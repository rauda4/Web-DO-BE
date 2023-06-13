const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

class UserController {
    static async CreateData(req, res){
        const {username, email, password} = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = await prisma.user.create({
                data: {
                    username,
                    email,
                    password:hashedPassword
                }
            });
            // validation empty data
            if(!username){
                return res.status(400).json({
                    result:"failed",
                    message:"username cannot be empty"
                });
            }
            if(!email){
                return res.status(400).json({
                    result:"failed",
                    message:"email cannot be empty"
                });
            }
            if(!password){
                return res.status(400).json({
                    result:"failed",
                    message:"password cannot be empty"
                });
            }
            res.status(200).json({
                message:"succes create data"
            });
        } catch (error) {
            res.status(500).json({ msg: error.message})
        }
    }

    static async getData(req, res, next){
        try {
            const users = await prisma.user.findMany();
            if(!users){
                return res.status(400).json({
                    message : "Data is Empty"
                });
            }
            res.status(200).json({
                result:"succes find data",
                payload: users,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController;