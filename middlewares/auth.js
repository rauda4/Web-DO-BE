const jwt = require("jsonwebtoken")

const authOnly = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
        jwt.verify( token, process.env.ACCES_TOKEN, (err,user) => {
            if(err){
                return res.status(403).json({auth:false, msg:"forbidden"});
            }
            req.user = user;
            next();
        });
    } else { 
        return res.status(401).json({auth: false, msg:"Unauthorized"});
    }
}

module.exports = authOnly