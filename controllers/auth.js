const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./../models/User');
const keys = require('./../config/keys');
const errorHandler = require('./../utils/errorHandler');

module.exports.login = async function(req, res){
  const candidate = await User.findOne({email: req.body.email});

  if(candidate){
    const passwordResult = await bcrypt.compare(req.body.password, candidate.password);
    if(passwordResult){
      const token = jwt.sign({
        email: candidate.email,
        userId: candidate._id
      }, keys.JWT, {expiresIn: 60 * 60});

      res.status(200).json({
        token: `Bearer ${token}`
      });

    }else{
      res.status(401).json({
        message: 'Пароли не совпадают'
      });
    }
  }else{
    res.status(404).json({
      message: 'Пользователь с таким email не найден.'
    });
  }
};

module.exports.register = async function(req, res){
  const candidate = await User.findOne({email: req.body.email});

  if(candidate){
    res.status(409).json({
      message: 'Такой email уже занят.'
    });
  }else{
    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      password: hashPassword,
      email: req.body.email
    });

    try {
      await user.save();
      res.status(201).json(user);
    } catch (error) {
      errorHandler(res, error);
    }

  }
};