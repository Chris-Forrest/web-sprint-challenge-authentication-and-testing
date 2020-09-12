const router = require('express').Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("./auth-model");
const restrict = require("./authenticate-middleware");

router.post('/register', async (req, res) => {
  try{
    const { username, password } = req.body
    const user = await Users.findBy({ username }).first()

    if(user){
        return res.status(409).json({ message: "Username is already taken."})
    }
    const newUser = await Users.add({
      username,
      password: await bcrypt.hash(password, 12),
    })
    const token = jwt.sign({
      userID: newUser.id,
    },process.env.JWT_SECRET)
    res.cookie("token",token)
    res.status(201).json(newUser)

  }catch(err){
    res.status(500).json({ message: "Could not add user to database"})
  }
});

router.post('/login', async (req, res) => {
  try{
    const { username, password } = req.body
    const user = await Users.findBy({ username }).first()

        if(!user){
            return res.status(401).json({ message: "Invalid credentials"})
        }
    //hash the password again and see if it matches what we have in the database
    const passwordValid = await bcrypt.compare(password, user.password)

    if(!passwordValid){
        return res.status(401).json({ message: "Invalid credentials"})
    }

    //generate new json web token 
    const token = jwt.sign({
        userID: user.id,
    },process.env.JWT_SECRET)
    //send the token back
    res.cookie("token", token)  //this sends the token back as a cookie 
    //this sends the cookie back in the body 
    res.status(200).json({ token:token, message:`Welcome ${user.username}`}) 

}catch(err){
    res.status(500).json({ message:"Could not find user in database"})
}
});


router.get("/users", restrict(), async(req, res, next) => {
  try{
      res.json(await Users.find())
  }catch(err){
      next(err)
  }
});


module.exports = router;
