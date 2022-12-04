const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.createUser = (req,res,next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });

    user.save()
  .then(result =>{
    res.status(201).json({
      message: "User created!",
      result: result
    });
  })
  .catch(err =>{
      res.status(500).json({
        message: "email already exists!",
        error: err
      });
    });

  });


  };


  exports.userLogin = (req,res,next) =>{
    let fetchedUser;
    User.findOne({email: req.body.email})
    .then(user =>{
      if(!user){
        return res.status(401).json({
          message: "Authentication failed!" // Authentication failed because user entered a wrong email which does not exist in the database.
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password); // Here user entered email matches and now we are checking whether the user entered password is same with the database or not and returning it. If the the result is true that means user credentials are validated. Otherwise we will send a authentication error code.
    })
    .then(result =>{
      if(!result){
        return res.status(401).json({
          message: "Authentication failed!"
        });
      }
      // User credentials are validated and we are creating token
      const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, process.env.JWT_KEY, {expiresIn: "1h"}); // sign = (payload(based on this input token will be created), secretKey(to hash the token and later use it to validate token from frontend), optional argument(to configure this token))
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });

    })
    .catch(err =>{
      return res.status(401).json({
        message: "Authentication failed!"
      });
    })
  };
