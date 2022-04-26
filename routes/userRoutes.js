const express = require('express');
const router = express.Router();
const { users } = require('../seed/data.json')
const { User } = require('../models')
const bcrypt = require('bcryptjs');
const { authenticateUser } = require('../middleware/auth-user');
const { check, validationResult } = require('express-validator');


//Handles requests and passes errors to global handler
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      // Forward error to the global error handler
      next(err);
    }
  }
}

//retrieves authenticated user's data
router.get('/', authenticateUser, asyncHandler( async (req, res)=> {
   const user = await req.currentUser;
   res.json({
     firstName: user.firstName,
     lastName: user.lastName,
     emailAddress: user.emailAddress,
     id: user.id,
   });
  }))

// validates user input to create a new user
router.post('/', [
  check('firstName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "first name"'),
  check('lastName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "last name"'),
  check('emailAddress')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "email"')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  check('password')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "password"')
], asyncHandler( async (req, res)=> {
    try {
    const errors = validationResult(req);
    const data = req.body;
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map( error => error.msg);
      res.status(400).json(errorMessages);
   } else {
      const encrytedPassword = data.password = bcrypt.hashSync(data.password, 10);
      const user = await User.create({
        firstName: data.firstName,
        lastName: data.lastName,
        emailAddress: data.emailAddress,
        password: encrytedPassword
      });
      users.push(user);
      await res.status(201)
               .location('/')
               .end();
    }
  //Handles "SequelizeUniqueConstraintError" and 'SequelizeValidationError'
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError')  {
      const errors = error.errors.map( err => err.message);
      console.error( "Validation errors: ", errors);
      res.status(400).json(errors);
    } else {
      throw Error();
    }
  }
}));

  module.exports = router;