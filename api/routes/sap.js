const express = require("express");
const router = express.Router();
const sapuser = require("./../models/sapuser.js");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const request = require('request');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/checkAuth.js');

router.post('/signup', (req, res, next) => {
    /**
     * Check for gcaptcha response
     */

    /**
     * Check if user email exists or not
     */
    sapuser
        .find({ email: req.body.email })
        .exec()
        .then((doc) => {
            if(doc.length >=1 ){
                res.status(409).json({
                    message: "user exists"
                });
            } else {
                /**
                 * Email and contact verification
                 * Make sure the content-type is empty because 
                 * multer needs to modify the req object
                 */
                //console.log(req.body.emailVerified + " " + req.body.contactVerified);
                    bcrypt.hash(req.body.password, 10, function (err, hash) {
                        if(err) {
                            res.status(500).json({
                                message: err
                            });
                        } else {
                            const newSapUser = new sapuser({
                                _id: mongoose.Types.ObjectId(),
                                name: req.body.name,
                                email: req.body.email,
                                password: hash,
                                contact: req.body.contact.toString(),
                                sapId: Number(process.env.sapCount)+1,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                gender: req.body.gender,
                                // dob: req.body.dob,
                                // address: req.body.address,
                                collegeName: req.body.collegeName,
                                city: req.body.city,
                                collegeId: req.body.collegeId,
                                gradYear: req.body.yog,
                            });
                            process.env.sapCount = Number(Number(process.env.sapCount)+1);
                            newSapUser
                                .save()
                                .then(result => {
                                    //console.log(result);
                                    res.status(200).json({
                                        message: "User Added",
                                        info: result
                                    });
                                })
                                .catch(err =>{
                                    res.status(500).json({
                                        message: err
                                    });
                                });
                    }
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: err
            });
        });
});

router.post('/verify', (req, res, next) => {
    const contactOTPsent = (Math.floor(Math.random() * (999999 - 100000)) + 100000).toString();
    const emailOTPsent = (Math.floor(Math.random() * (999999 - 100000)) + 100000).toString();
    let statusEmail = 0, statusmobile = 0;
    let otp = {
        emailOTPsent: emailOTPsent,
        mobileOTPsent: contactOTPsent
    }
    /**
     * sending email otp
     */
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.userEmail,
            pass: process.env.userPass
        }
    });
    
    const mailOptions = {
        from: process.env.userEmail,
        to: req.body.email,
        subject: 'Email verification',
        html: '<p>Your OTP is: ' + emailOTPsent + '</p>'
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: err
            });
        } 
        else {
            console.log("Email OTP sent Successfully");
            /**
         * sending phone otp
         */

            let otpurl = `http://sms.digimiles.in/bulksms/bulksms?username=di78-bitmesra&password=digimile&type=0&dlr=1&destination=${req.body.contact}&source=PANTHN&message=Your OTP for Pantheon is: ${contactOTPsent}`
            request(otpurl, (error, response, body) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({
                        error: error
                    });
                } else {
                    statusmobile = 1;
                    console.log("Mobile OTP sent successfully");
                    res.status(200).json({
                        message: "OTP generated",
                        otp: otp
                    });
                }
            });
        }
    });

    
});

router.post('/login', (req, res, next)=>{
     sapuser
        .find({ email: req.body.email })
        .exec()
        .then(user =>{
            if(user.length < 1){
                return res.status(401).json({
                    message: "Auth faileds"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
                if(result){
                    const token = jwt.sign({
                            email: user[0].email,
                            password: user[0].password
                        },
                        process.env.jwt_token, {
                            'expiresIn': '1h'
                        }
                    );
                    return res.status(200).json({
                        message: "true",
                        token: token
                    });
                } else {
                    return res.status(401).json({
                        message: "auth Failed"
                    });
                }
                
            });
        })
        .catch(err => {
            res.status(500).json({
                message:  err
            });
        });
});

router.get('/profile', checkAuth, (req, res, next)=>{
    sapuser
        .find({ email: req.userData.email })
        .exec()
        .then((doc) => {
            if(doc.length < 1) {
                res.status(500).json({
                    message: "User Not matched with token"
                });
            } else {
                res.status(200).json({
                    message: "User found",
                    user: doc
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: err
            });
        });
});

router.patch('/profile', checkAuth, (req, res, next) => {
    // const updateOps = {};
    // for (const ops of req.body) {
    //     updateOps[ops.propName] = ops.value;
    // }
    sapuser
        .update({
            email: req.userData.email
        }, {
            $set: req.body
        })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: "User Updated!",
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                "error": error
            });
        });
});

router.delete('/profile', checkAuth, (req, res, next) => {
    sapuser
        .remove({ email: req.userData.email })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User Deleted!"
            });
        })
        .catch(err => {
            res.status(500).json({
                message: err
            });
        });
});

module.exports = router;