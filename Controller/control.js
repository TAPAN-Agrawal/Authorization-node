require('dotenv').config()
const { User, Otp } = require('../Model/model')
const { sign, verify } = require('jsonwebtoken')
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

exports.register = async (req, res) => {
    try {
        const {
            names,
            email,
            password,
            phoneNumber,
        } = req.body

        const user = new User({
            names,
            email,
            password,
            phoneNumber,
        })

        User.create(user)
        console.log('User is valid');
        res.status(200).json({ message: "User Created Woooooooooooooo" });

    } catch (error) {
        res.status(400).json({ message: error.message })

    }

}
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email, password })
        console.log(user._id);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }
        else {
            // create reusable transporter object using the default SMTP transport
            let otp = Math.floor(100000 + Math.random() * 900000);
            console.log(otp);
            const transporter = nodemailer.createTransport({
                // host: 'smtp.ethereal.email',
                host: 'smtp.gmail.com',
                port: 587,
                auth: {
                    user: process.env.MAIL,
                    // pass: 'A4nrm3UE8AzUK6YZxR',
                    pass: process.env.PASSWORD
                }
            });
            // send mail with defined transport object
            let mailOptions = {
                from: '"Tapan Agrawal" <taapanagrawal2002@gmail.com>', // sender address
                to: email, // list of receivers
                subject: 'OTP VERIFICATION', // Subject line
                text: `Your OTP for verification is ${otp}`,
                html: `<p>Your OTP for verification is <b>${otp}</b></p>`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                const otpData = {
                    userId: user._id
                }
                const expireTime = { expiresIn: '30m' }
                // console.log(otpData);
                const token = sign(
                    otpData,
                    process.env.JWTSECRETTOKEN,
                    expireTime)
                console.log("token", token);
                Otp.create({
                    token: token,
                    otp: otp
                })
                // console.log('Message sent: %s', info.messageId);
                return res.json({
                    token,
                    message: info.messageId
                })
            });
        }

    } catch (error) {

    }
}

// const mail = async (id, email) => {

//     try {
//         // create reusable transporter object using the default SMTP transport
//         let otp = Math.floor(100000 + Math.random() * 900000);
//         console.log(otp);
//         const transporter = nodemailer.createTransport({
//             // host: 'smtp.ethereal.email',
//             host: 'smtp.gmail.com',
//             port: 587,
//             auth: {
//                 user: process.env.MAIL,
//                 // pass: 'A4nrm3UE8AzUK6YZxR',
//                 pass: process.env.PASSWORD
//             }
//         });
//         // send mail with defined transport object
//         let mailOptions = {
//             from: '"Tapan Agrawal" <taapanagrawal2002@gmail.com>', // sender address
//             to: email, // list of receivers
//             subject: 'OTP VERIFICATION', // Subject line
//             text: `Your OTP for verification is ${otp}`,
//             html: `<p>Your OTP for verification is <b>${otp}</b></p>`
//         };

//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 return console.log(error);
//             }
//             const otpData = {
//                 userId: id
//             }
//             const expireTime = { expiresIn: '30m' }
//             // console.log(otpData);
//             const token = sign(
//                 otpData,
//                 process.env.JWTSECRETTOKEN,
//                 expireTime)
//             console.log("token", token);
//             Otp.create({
//                 token: token,
//                 otp: otp
//             })
//             // console.log('Message sent: %s', info.messageId);
//             res.json({
//                 token,
//                 message: info.messageId
//             })
//         });
//     } catch (error) {

//     }
// }

exports.verifyotp = async (req, res) => {
    const { token } = req.query;
    const otpData = await Otp.findOne({ token }).exec();
    const userotp = req.body.otp
    if (otpData) {
        if (userotp == otpData.otp) {
            await Otp.findOneAndDelete({token})
            res.status(200).json({ message: "user has verified otp now give access" })
        }else{
            res.status(400).json({ message: "You OTP is Not Match" })
        }
    }
    else {
        res.status(400).json({ message: "Your OTP is Expired" }) 
    }
}
