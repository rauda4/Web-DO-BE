const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function login(req, res){
    try {
        const {username, password} = req.body;
        if(!username){
            return res.status(401).json({ msg:"username cannot be empty!"})
        }
        if(!password){
            return res.status(401).json({ msg:"password cannot be empty!"})
        }
        // find users based on unique
        const users = await prisma.user.findUnique({
            where:{username}
        });
        // validation error cannot find users
        if(!users){
            return res.status(401).json({msg:"user not found"})
        }
        // add compare for password
        const compare = await bcrypt.compare(password, users.password)
        // validation when password not same
        if(!compare){
            return res.status(401).json({auth: false, message:"password doesnt match!"})
        }
        // add sign with jwt
        const token = jwt.sign(
            { id:users.id, username:users.username }, 
            process.env.TOKEN,
            (err, token) => {
                res.status(200).json({auth:true, status:"authorized", token})
            }
        )
    } catch (error) {
        res.status(404).json({msg: error.message})
    }
}

module.exports = login;