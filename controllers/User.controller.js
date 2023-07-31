const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

class UserController {
    static async CreateUser(req, res){
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

    static async getUser(req, res){
        try {
            const users = await prisma.user.findMany({
                orderBy:{
                    username:'desc'
                }
            });
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
            res.status(500).json({ msg: error.message})
        }
    }

    static async GetUserById(req, res){
        const { id } = req.params;
        try {
            const users = await prisma.user.findUnique({ where: {id}});
            if(!users){
                return res.status(400).json({
                    result:"users not found"
                });
            }
            res.status(200).json({
                message:`succes find users with id ${id}`,
                data: users
            })
        } catch (error) {
            res.status(500).json({ msg: error.message})
        }        
    }
    
    static async GetUserByQuery(req, res){
        try {
            const {key} = req.params;
            const users = await prisma.user.findMany({ 
                where: {
                   username:{
                    startsWith:key
                   },
                },
                orderBy:{
                    username:'asc'
                }
            });
            if(!users){
                return res.status(400).json({
                    result:"users not found"
                });
            }
            res.status(200).json({
                message:`succes find query ${key}`,
                data:users
            })
        } catch (error) {
            res.status(500).json({ msg: error.message})
        }        
    }

    static async updateUser(req, res){
        try {
            const { id } = req.params
            const {username, email, password} = req.body;
            const updateData = await prisma.user.update({
                where: {id},
                data: req.body
            });
            res.status(200).json({
                result:"succes",
                message:`user with id = ${id} updated`,
                data: updateData
            })
        } catch (error) {
            res.status(500).json({ msg: error.message})
        }
    }
    static async deleteUser(req, res){
        const { id } = req.params;
        try {
            const users = await prisma.user.delete({ 
                where: {id}
            })
            if(!users){
                return res.status(400).json({msg:"cannot delete"});
            }
            res.status(200).json({msg:`succes delete user with id`})
        } catch (error) {
            res.status(400).json({msg: error.message})
        }
    }
}

module.exports = UserController;