const express = require("express")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("./auth-model");
const restrict = require("./authenticate-middleware");

const router = express.Router();

router.post('/register', async (req, res) => {
  try{
    const { username, password } = req.body
    const user = await Users.findBy({username}).first()

    if(user){
      return res.status(409).json({ message: "username already exists"})
    }
    const newUser = await Users.add({
      username,
      password: await bcrypt.hash(password,12)
    }) 
    const token = jwt.sign({
      userID: newUser.id,
    },process.env.JWT_SECRET||"it can't rain all the time")
    res.cookie("token",token)
   // res.status(201).json({ token:token, message:`Welcome ${newUser.username}`})
   // const token = makeToken(newUser);
    res.status(201).json(newUser)
  }catch(err){
    console.log(err)
    res.status(500).json({ message: "could not create user"})
  }
});

router.post("/login",async (req,res) => {
  try{
    const { username,password } = req.body
     const user = await Users.findBy({username}).first()
   // console.log("login route user find",user)
      if(!user){
        return res.status(401).json({ message: "Invalid username"})
      }
      const passwordValid = await bcrypt.compare(password, user.password)
      if(!passwordValid){
        return res.status(401).json({ message: "Invalid password"})
      }
      const token = jwt.sign({ 
        userId: user.id,
      },process.env.JWT_SECRET||"it can't rain all the time");
      res.cookie("token",token);
      //res.status(200).json({token:token, message:`Welcome ${user.username}`})
      res.status(200).json({ token , message:`Welcome ${user.username}`})

  }catch(err){
    console.log("error from login call",err)
    res.status(500).json({ message: "could not login"})
  }
});


router.get("/users", restrict, async(req, res) => {
  try{
    const users = await Users.find()
      res.json(users)
  }catch(err){
      next(err)
  }
});

module.exports = router;
