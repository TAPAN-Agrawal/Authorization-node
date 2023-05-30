const router=require('express').Router()
const {register,login,mail,verifyotp}=require('../Controller/control')
const { check} = require('express-validator');


router.post('/register'
// ,[
//     check('names')
//         .notEmpty()
//         .withMessage('name should not be empty')
//         .isLength({min:3})
//         .withMessage('name should not be less than three letters'),
//     check('email')
//     .notEmpty()
//      .withMessage('email should not be empty')
//      .isLength({min:3})
//     .withMessage('email should not be less than three letters')
    


// ]
,register)
router.post('/login',login)

// router.get('/mail',mail)
router.post('/verifyotp',verifyotp)

module.exports=router