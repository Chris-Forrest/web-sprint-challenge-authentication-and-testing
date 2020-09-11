const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  
   try{
        const token = req.headers.authorization;
        if(!token){
          return res.status(401).json({message:"no token!"})
        }
        jwt.verify(token, process.env.JWT_SECRET, (err,decoded) => {
          if(err){
            return res.status(401).json({message: "invalid token"})
          }
          req.token = decoded
          next()
        })
   }catch(err){
     res.status(401).json({ you: 'shall not pass!' });
   }
  
};
