const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


class AuthController {
    static async Register(req, res){
        const {username, email, password} = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 12);
            const userExists = !!await prisma.user.findFirst({where:{username}});
            const user = await prisma.user.create({
                data: {
                    username,
                    email,
                    password:hashedPassword
                }
            });
            // validation user already exists
            if(userExists){
                return res.status(400).json({
                    result:"failed",
                    message:"user already exists"
                })
            }

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
            res.status(500).json({ msg:"Failed to create a user because it already exists or data doesn't match"})
        }
    }

    static async login(req, res){
        try {
            const {username, password} = req.body;
            if(!username){
                return res.status(401).json({auth: false, msg:"username cannot be empty!"})
            }
            if(!password){
                return res.status(401).json({auth: false, msg:"password cannot be empty!"})
            }
            // find users based on unique
            const users = await prisma.user.findUnique({
                where:{username}
            });
            // validation error cannot find users
            if(!users){
                return res.status(401).json({auth: false, msg:"user not found"})
            }
            // add compare for password
            const compare = await bcrypt.compare(password, users.password)
            // validation when password not same
            if(!compare){
                return res.status(401).json({auth: false, msg:"password doesnt match!"})
            }
            // add sign with jwt
            const accesToken = jwt.sign(
                { id:users.id, username:users.username, email:users.email }, 
                process.env.ACCES_TOKEN,
                {expiresIn:'20s'},
                (err, accesToken) => {
                    res.status(200).json({auth:true, status:"authorized", accesToken})
                }
            )
        } catch (error) {
            res.status(404).json({msg: error.message})
        }
    }
}

module.exports = AuthController;