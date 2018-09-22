const express = require("express");
const router = express.Router();
const users = require("../models/users.js");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const request = require('request');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/checkAuth.js');
const config = require('../config.json');
const counter = require('./../models/counters.js');



router.post('/register', (req, res, next) => {
    //captcha response
    if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null){
        res.status(400).json({
            status: "fail",
            message: "Invalid Captcha"
        });
    }

    users
        .find({email: req.body.email})
        .exec()
        .then((User) => {
            //console.log(User);
            if(User && User.length>=1 && User[0].otpverified === 'yes'){
                res.status(200).json({
                    status: "exists",
                    message: "The user already exists!!"
                });
            } else {
                    const contactOTPsent = (Math.floor(Math.random() * (999999 - 100000)) + 100000).toString();
                    const emailOTPsent = (Math.floor(Math.random() * (999999 - 100000)) + 100000).toString();
                    let otp = {
                        emailOTPsent: emailOTPsent,
                        mobileOTPsent: contactOTPsent
                    }
                    /**
                     * sending email otp
                     */

                    var transporter = nodemailer.createTransport({
                        service: 'Godaddy',
                        host: 'smtpout.asia.secureserver.net',
                        port: 25,
                        secureConnection: false,
                        auth: {
                            user: 'web@pantheon18.in',
                            pass: 'Manish@123'
                        }
                    });

                    const emailMessage = " <h1>Pantheon'18</h1><br><p>Here's your OTP:" + otp.emailOTPsent + "</p>";

                    const mailOptions = {
                        from: "web@pantheon18.in",
                        to: req.body.email,
                        subject: 'Email verification',
                        html: emailMessage
                    };
                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({
                                status: "fail",
                                message: err
                            });
                        } else {
                            console.log("Email OTP sent Successfully");
                            /**
                             * sending phone otp
                             */

                            let otpurl = `http://sms.digimiles.in/bulksms/bulksms?username=di78-bitmesra&password=digimile&type=0&dlr=1&destination=${req.body.contact}&source=PANTHN&message=Hi ${req.body.name}, Your OTP for Pantheon'18 is: ${otp.mobileOTPsent}`
                            request(otpurl, (error, response, body) => {
                                if (error) {
                                    console.log(error);
                                    res.status(500).json({
                                        status: "fail",
                                        message: error
                                    });
                                } else {
                                    console.log("Mobile OTP sent successfully");
                                    users
                                        .find({
                                            email: req.body.email
                                        })
                                        .exec()
                                        .then((doc) => {
                                            if (doc === null || doc.length < 1) {
                                                // new user
                                                bcrypt.hash(req.body.pass, 10, (err, hash) => {
                                                    if (err) {
                                                        res.status(500).json({
                                                            status: "fail",
                                                            message: err
                                                        });
                                                    } else {
                                                        const newuser = new users({
                                                            _id: mongoose.Types.ObjectId(),
                                                            name: req.body.name,
                                                            email: req.body.email,
                                                            password: hash,
                                                            contact: req.body.contact,
                                                            emailotp: otp.emailOTPsent,
                                                            phoneotp: otp.mobileOTPsent,
                                                            createdAt: new Date().toISOString(),
                                                            updatedAt: new Date().toISOString(),

                                                        });
                                                        newuser
                                                            .save()
                                                            .then((result) => {
                                                                console.log(result);
                                                                res.status(200).json({
                                                                    status: "success",
                                                                    message: "OTP sent successfully!!"
                                                                });
                                                            })
                                                            .catch((err) => {
                                                                console.log(err);
                                                                res.status(500).json({
                                                                    status: "fail",
                                                                    message: err
                                                                });
                                                            });
                                                    }
                                                })
                                            } else {
                                                bcrypt.hash(req.body.pass, 10, (err, hash) => {
                                                    if (err) {
                                                        res.status(500).json({
                                                            status: "fail",
                                                            message: err
                                                        })
                                                    } else {
                                                        users.update({
                                                                email: doc[0].email
                                                            }, {
                                                                $set: {
                                                                    emailotp: otp.emailOTPsent,
                                                                    phoneotp: otp.mobileOTPsent,
                                                                    name: req.body.name,
                                                                    email: doc[0].email,
                                                                    password: hash,
                                                                    contact: req.body.contact,
                                                                    updatedAt: new Date().toISOString(),
                                                                }
                                                            })
                                                            .then((result) => {
                                                                console.log("OTP updated successfully!!");
                                                                res.status(200).json({
                                                                    status: "success",
                                                                    message: "OTP sent successfully!!"
                                                                });
                                                            })
                                                            .catch((err) => {
                                                                console.log(err);
                                                                res.status(500).json({
                                                                    status: "fail",
                                                                    message: err
                                                                });
                                                            });
                                                    }
                                                });

                                            }
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                            res.status(500).json({
                                                status: "fail",
                                                message: err
                                            });
                                        });

                                }
                            });
                        }
                    });

            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                status: "fail",
                message: err
            });
        });
});

router.post('/verify', (req, res, next) =>{
    users
        .find({ email: req.body.email })
        .exec()
        .then((doc) => {
            if(doc===null || doc.length < 1){
                res.status(400).json({
                    status: "fail",
                    message: "Payload modified. User Not found."
                });
            } else {
                console.log(req.body);
                console.log(doc);
                if(doc[0].emailotp !== parseInt(req.body.emailotp.trim())){
                    res.status(200).json({
                        status: "fail",
                        message: "Wrong Email OTP. Please try again."
                    });
                } else if(doc[0].phoneotp !== parseInt(req.body.mobileotp.trim())){
                    res.status(200).json({
                        status: "fail",
                        message: "Wrong Mobile OTP. Please try again."
                    })
                } else {
                    users
                        .update({
                            email: req.body.email
                        }, {
                            $set: {
                                otpverified: "yes"
                            }
                        })
                        .exec()
                        .then((result) => {
                            res.status(200).json({
                                status: "success",
                                message: "OTP verified Successfully!!"
                            });
                        })
                        .catch((err) => {
                            res.status(500).json({
                                status: "fail",
                                message: err
                            });
                        });
                }
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                status: "fail",
                message: err
            });
        });
});

router.post('/submit', (req, res, next) => {
    counter
        .find({ identifier: "pantheonId" })
        .exec()
        .then((doc) => {
            if(doc===null || doc.length<1){
                res.status(500).json({
                    status: 'fail',
                    msg: 'Some Error Occured'
                });
            } else {
                console.log(doc);
                let pantheonID = doc[0].count;
                users
                    .update({
                        email: req.body.email,
                    }, {
                        $set: {
                            dob: req.body.dob,
                            collegeName: req.body.clgname,
                            collegeCity: req.body.clgcity,
                            collegeState: req.body.clgstate,
                            collegeId: req.body.rollnum,
                            gradYear: req.body.gradYear,
                            panId: parseInt(pantheonID),
                            gender: req.body.gender,
                            sapId: req.body.sapId
                        }
                    })
                    .exec()
                    .then((result) => {
                        console.log(result);
                        counter
                            .update({
                                identifier: "pantheonId"
                            }, {
                                $set: {
                                    count: parseInt(pantheonID+1)
                                }
                            })
                            .exec()
                            .then((fresult) => {
                                res.status(200).json({
                                    status: "success",
                                    message: "Successfully Registered!!"
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                                res.status(500).json({
                                    status: "fail",
                                    message: err
                                });
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).json({
                            status: "fail",
                            message: err
                        });
                    });
            }

        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                status: "fail",
                message: err
            });
        });

});

router.post('/login', (req, res, next) => {
    users
        .find({
            email: req.body.email
        })
        .exec()
        .then((user) => {
            if (user===null || user.length < 1) {
                return res.status(200).json({
                    status: 'fail',
                    message: 'User Not found.'
                });
            } else if( user[0].otpverified === 'no' ) {
                return res.status(200).json({
                    status: 'fail',
                    message: 'You have not been successfully registered.'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err) {
                    console.log(err);
                    res.status(500).json({
                        status: 'fail',
                        message: err
                    })
                } else{
                    if (result) {
                        const token = jwt.sign({
                                email: user[0].email,
                                password: user[0].password
                            },
                            config.jwt_token, {
                                'expiresIn': '1h'
                            }
                        );
                        return res.status(200).json({
                            status: "success",
                            message: "Successfully Logged In.",
                            token: token
                        });
                    } else {
                        return res.status(200).json({
                            status: 'fail',
                            message: 'Password Matching Error'
                        });
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                status: 'fail',
                message: err
            });
        });
});

router.get('/profile', checkAuth, (req, res, next) => {
    users
        .find({
            email: req.userData.email
        })
        .exec()
        .then((doc) => {
            if (doc===null || doc.length < 1) {
                res.status(500).json({
                    status: 'fail',
                    message: "User Not allowed"
                });
            } else {
                res.status(200).json({
                    status: 'success',
                    message: "User found",
                    user: doc
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                status: 'fail',
                message: err
            });
        });
});

router.patch('/profile', checkAuth, (req, res, next) => {
    // const updateOps = {};
    // for (const ops of req.body) {
    //     updateOps[ops.propName] = ops.value;
    // }
    users
        .update({
            email: req.userData.email
        }, {
            $set: req.body
        })
        .exec()
        .then((result) => {
            console.log(result);
            res.status(200).json({
                status: 'success',
                message: "User Updated!"
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                status: 'fail',
                message: error
            });
        });
});

router.delete('/profile', checkAuth, (req, res, next) => {
    users
        .remove({
            email: req.userData.email
        })
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
router.post('/teamRegister', (req, res, next) => {
    
});
module.exports = router;

// router.post('/signup', (req, res, next) => {
//     /**
//      * Check for gcaptcha response
//      */

//     /**
//      * Check if user email exists or not
//      */
//     sapuser
//         .find({
//             email: req.body.email
//         })
//         .exec()
//         .then((doc) => {
//             if (doc.length >= 1) {
//                 res.status(409).json({
//                     message: "user exists"
//                 });
//             } else {
//                 /**
//                  * Email and contact verification
//                  * Make sure the content-type is empty because
//                  * multer needs to modify the req object
//                  */
//                 //console.log(req.body.emailVerified + " " + req.body.contactVerified);
//                 bcrypt.hash(req.body.password, 10, function (err, hash) {
//                     if (err) {
//                         res.status(500).json({
//                             message: err
//                         });
//                     } else {
//                         const newSapUser = new sapuser({
//                             _id: mongoose.Types.ObjectId(),
//                             name: req.body.name,
//                             email: req.body.email,
//                             password: hash,
//                             contact: req.body.contact.toString(),
//                             sapId: Number(process.env.sapCount) + 1,
//                             createdAt: new Date(),
//                             updatedAt: new Date(),
//                             gender: req.body.gender,
//                             // dob: req.body.dob,
//                             // address: req.body.address,
//                             collegeName: req.body.collegeName,
//                             city: req.body.city,
//                             collegeId: req.body.collegeId,
//                             gradYear: req.body.yog,
//                         });
//                         process.env.sapCount = Number(Number(process.env.sapCount) + 1);
//                         newSapUser
//                             .save()
//                             .then(result => {
//                                 //console.log(result);
//                                 res.status(200).json({
//                                     message: "User Added",
//                                     info: result
//                                 });
//                             })
//                             .catch(err => {
//                                 res.status(500).json({
//                                     message: err
//                                 });
//                             });
//                     }
//                 });
//             }
//         })
//         .catch(err => {
//             res.status(500).json({
//                 message: err
//             });
//         });
// });
