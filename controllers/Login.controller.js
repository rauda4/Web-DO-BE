const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function login(req, res){
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

module.exports = login;