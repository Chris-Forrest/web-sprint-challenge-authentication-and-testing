const router = require('express').Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("./auth-model");
const restrict = require("./authenticate-middleware");

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
    res.status(201).json(newUser)
  }catch(err){
    console.log(err)
    res.status(500).json({ message: "could not create user"})
  }
});

router.post('/login', async (req, res) => {
  try{
    const { username, password} = req.body
    const user = await Users.findBy({usernmae}).first()
    const validateError = {
      message:"You shall not pass"
    }
    if(!user){
      return res.status(401).json(validateError)
    }
    const passwordValid = await bcrypt.compare(password, user.password)
    if(!passwordValid){
      return res.status(401).json(validateError)
    }

    const token = jwt.sign({
      userID: user.id,

    },process.env.JWT_SECRET)
    res.cookie("token,token")
    res.status(200).json({ token:token, message: `Welcom ${user.username}`})

  }catch(err){
    res.status(500).json({ message: "could not find user"})
  }
});


router.get("/users", restrict, async(req, res, next) => {
  try{
      res.json(await Users.find())
  }catch(err){
      next(err)
  }
});


module.exports = router;
