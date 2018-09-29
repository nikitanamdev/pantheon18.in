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
const lookups = require('./../models/lookups');
const teams = require('./../models/teams');
//const Events = require('./../events.json');

router.post('/register', (req, res, next) => {
    //captcha response
    // if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null){
    //     res.status(400).json({
    //         status: "fail",
    //         message: "Invalid Captcha"
    //     });
    // }

    users
        .find({email: req.body.email})
        .exec()
        .then((User) => {
            //console.log(User);
            if(User && User.length>=1 && User[0].otpverified === 'yes' && User[0].panId !== -1){
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
                    msg: 'You have not been registered. Please try again.'
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
                                    message: "Congratulations! You have been Successfully Registered!!"
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
        } else if( user[0].otpverified === 'no' || user[0].panId === -1) {
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
                    message: "User Not Found"
                });
            } else {
                lookups
                    .find({ email: req.userData.email })
                    .exec()
                    .then((lookupdoc) => {
                        if(lookupdoc===null || lookupdoc.length < 1){
                            console.log('User found,but no team.');
                            res.status(200).json({
                                status: 'success',
                                message: "User found",
                                user: doc,
                                teamDetails: [],
                                teamRequests: [],
                                isTeamLeader : "no"
                            });
                        } else {
                            if(lookupdoc[0].teamName.length>0){
                                console.log('User found and team present.');
                                teams
                                    .find({teamName : lookupdoc[0].teamName})
                                    .exec()
                                    .then((team) => {
                                        console.log('Team Leader.');
                                        res.status(200).json({
                                            status: 'success',
                                            message: "User found",
                                            user: doc,
                                            teamDetails: team,
                                            teamRequests: [],
                                            isTeamLeader: lookupdoc[0].teamLeader
                                        });
                                    })
                                    .catch((err) => {
                                        res.status(500).json({
                                            status: 'fail',
                                            message: err
                                        });
                                    });
                            }
                            else{
                                console.log('User found but no team');
                                res.status(200).json({
                                    status: 'success',
                                    message: "User found",
                                    user: doc,
                                    teamDetails: [],
                                    teamRequests: lookupdoc[0].requests,
                                    isTeamLeader: lookupdoc[0].teamLeader
                                });
                            }
                        }
                    })
                    .catch(err => {
                        res.status(500).json({
                            status: 'fail',
                            message: err
                        });
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
    let deleteCount = 0;
    users
        .remove({email: req.userData.email})
        .exec()
        .then(result => {
            lookups
                .findOneAndDelete({ email: req.userData.email })
                .exec()
                .then((look) => {
                    console.log(look);
                    if(look === null) {
                        console.log('user deleted but no team only lookup.')
                        res.status(200).json({
                            status: 'success',
                            message: "User Deleted"
                        });
                    } else if (look.teamLeader === 'yes') {
                        const teamLeaderTeam = look.teamName;
                        teams
                            .findOneAndDelete({ teamName : teamLeaderTeam })
                            .exec()
                            .then((deletedTeam) => {
                                console.log(deletedTeam);
                                for(let i=0;i<deletedTeam.teamMembers.length;i++){
                                    if (deletedTeam.teamMembers[i] !== req.userData.email){
                                        lookups
                                            .findOneAndUpdate({
                                                email: deletedTeam.teamMembers[i]
                                            }, {
                                                $set: {
                                                    teamName : ""
                                                }
                                            }, {
                                                new: true
                                            })
                                            .exec()
                                            .then((updatedDoc) => {
                                                console.log("updated" + deletedTeam.teamMembers[i]);
                                                console.log(updatedDoc);
                                                deleteCount = deleteCount+1;
                                                if (deleteCount == deletedTeam.teamMembers.length - 1) {
                                                    res.status(200).json({
                                                        status: 'success',
                                                        message: "User deleted Successfully"
                                                    });
                                                }
                                            })
                                            .catch((err) => {
                                                res.status(500).json({
                                                    status: 'fail',
                                                    message: err
                                                });
                                            });
                                    }
                                }
                            })
                            .catch((err) => {
                                res.status(500).json({
                                    status: 'fail',
                                    message: err
                                });
                            });
                    } else if (look.teamLeader === 'no') {
                        // Not a Team Leader
                        console.log(look);
                        teams
                            .findOneAndUpdate({
                                teamName: look.teamName
                            }, {
                                $pull: {
                                    teamMembers: req.userData.email
                                }
                            })
                            .exec()
                            .then(result => {
                                console.log("Updated");
                                res.status(200).json({
                                    status: "success",
                                    message: "user deleted Successfully"
                                });
                            })
                            .catch((err) => {
                                res.status(500).json({
                                    status: 'fail',
                                    message: err
                                });
                            });
                    } else {
                        res.status(200).json({
                            status: 'fail',
                            message: 'Some Error Occured!'
                        });
                    }
                })
                .catch((err) => {
                    res.status(500).json({
                        status: 'fail',
                        message: err
                    });
                });
        })
        .catch(err => {
            res.status(500).json({
                status: 'fail',
                message: err
            });
        });
});

router.get('/preTeamRegistration', checkAuth, (req, res, next) => {
    lookups
        .find({ email: req.userData.email })
        .exec()
        .then((lookupResult)=>{

            if(lookupResult===null || lookupResult.length < 1){
                console.log("andar");
                // user can make the team
                const newlookup = new lookups({
                    _id: mongoose.Types.ObjectId(),
                    email: req.userData.email,
                    teamRequests: []
                });
                newlookup
                    .save()
                    .then((savedResult)=>{
                        res.status(200).json({
                            status: 'success',
                            message: 'Lookup updated',
                            email: req.userData.email
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            status: 'fail',
                            message: err
                        });
                    });
            } else {
                if(lookupResult[0].teamName===""){
                    // user can still make team
                    res.status(200).json({
                        status: 'success',
                        message: "user can make the team.",
                        email : req.userData.email
                    });
                } else {
                    // user can't make team
                    res.status(200).json({
                        status: 'fail',
                        message: "You are already in a Team."
                    });
                }
            }
        })
        .catch(err => {
            res.status(500).json({
                status: 'fail',
                message: err
            });
        });
});

router.post('/teamRegister', checkAuth, (req, res, next)=> {
    teams
        .find({ teamName: req.body.teamName })
        .exec()
        .then((teamSearchResult)=>{
            if ((teamSearchResult === null || teamSearchResult.length < 1) && req.body['teamMembers[]'].length == 1) {
                console.log(req.body['teamMembers[]']); 
                console.log(req.body['teamMembers[]'].length);
                    console.log(req.body);
                    lookups
                        .find({
                            email: req.userData.email
                        })
                        .exec()
                        .then(foundOne => {
                            if (foundOne === null || foundOne.length < 1) {
                                // save the lookup
                                const teamLeaderLookup = new lookups({
                                    _id: mongoose.Types.ObjectId(),
                                    email: req.userData.email,
                                    teamName: req.body.teamName,
                                    teamLeader: "yes",
                                    requests: []
                                });
                                teamLeaderLookup
                                    .save()
                                    .then((savedResult) => {
                                        bcrypt.hash(req.body.teamPass, 10, (err, hash) => {
                                            if (err) {
                                                console.log(err);
                                                return res.status(500).json({
                                                    status: 'fail',
                                                    message: err
                                                });
                                            } else {
                                                let memberArray = [];
                                                memberArray.push(req.userData.email);
                                                const newTeam = new teams({
                                                    _id: mongoose.Types.ObjectId(),
                                                    teamName: req.body.teamName,
                                                    teamPassword: hash,
                                                    teamMembers: memberArray,
                                                });
                                                newTeam
                                                    .save()
                                                    .then(teamSaveResult => {
                                                        return res.status(200).json({
                                                            status: 'success',
                                                            message: 'Team Successfully registered.All users verified. A request has been sent to all the members. Further details can be viewed in your profile.'
                                                        });
                                                    })
                                                    .catch(err => {
                                                        console.log(err);
                                                        return res.status(500).json({
                                                            status: 'fail',
                                                            message: err
                                                        })
                                                    });
                                            }
                                        });

                                    })
                                    .catch(err => {
                                        console.log(err);
                                        return res.status(500).json({
                                            status: 'fail',
                                            message: err
                                        });
                                    });
                            } else {
                                // update the lookup
                                lookups
                                    .update({
                                        email: req.userData.email
                                    }, {
                                        $set: {
                                            //email: req.userData.email,
                                            teamName: req.body.teamName,
                                            teamLeader: "yes",
                                            requests: []
                                        }
                                    })
                                    .then((savedResult) => {
                                        bcrypt.hash(req.body.teamPass, 10, (err, hash) => {
                                            if (err) {
                                                console.log(err);
                                                return res.status(500).json({
                                                    status: 'fail',
                                                    message: err
                                                });
                                            } else {
                                                let memberArray = [];
                                                memberArray.push(req.userData.email);
                                                const newTeam = new teams({
                                                    _id: mongoose.Types.ObjectId(),
                                                    teamName: req.body.teamName,
                                                    teamPassword: hash,
                                                    teamMembers: memberArray,
                                                });
                                                newTeam
                                                    .save()
                                                    .then(teamSaveResult => {
                                                        return res.status(200).json({
                                                            status: 'success',
                                                            message: 'Team Successfully registered.All users verified. A request has been sent to all the members. Further details can be viewed in your profile.'
                                                        });
                                                    })
                                                    .catch(err => {
                                                        console.log(err);
                                                        return res.status(500).json({
                                                            status: 'fail',
                                                            message: err
                                                        })
                                                    });
                                            }
                                        });

                                    })
                                    .catch(err => {
                                        console.log(err);
                                        return res.status(500).json({
                                            status: 'fail',
                                            message: err
                                        });
                                    });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                status: 'fail',
                                message: err
                            });
                        });
                } else if (teamSearchResult === null || teamSearchResult.length < 1) {
                    for (let i = 0; i < req.body['teamMembers[]'].length-1; i++) {
                        const participant = req.body['teamMembers[]'][i];
                        console.log(participant);
                        users
                            .find({
                                email: participant
                            })
                            .exec()
                            .then((userResult) => {
                                if (userResult === null || userResult.length < 1) {
                                    return res.status(200).json({
                                        status: 'fail',
                                        message: "The user: " + participant + " doesn't exists"
                                    });
                                } else {
                                    // update the lookup table
                                    lookups
                                        .find({
                                            email: participant
                                        })
                                        .exec()
                                        .then(resultLookup => {
                                            if (resultLookup === null || resultLookup.length < 1) {
                                                var requestArray = [];
                                                requestArray.push(req.body.teamName);
                                                const newuserLookup = new lookups({
                                                    _id: mongoose.Types.ObjectId(),
                                                    email: participant,
                                                    requests: requestArray
                                                });
                                                newuserLookup
                                                    .save()
                                                    .then((lookupUpdate) => {
                                                        console.log("Lookup updated. Request sent to user : " + participant);
                                                        if (i === req.body['teamMembers[]'].length - 2) {
                                                            lookups
                                                                .find({
                                                                    email: participant
                                                                })
                                                                .exec()
                                                                .then(foundOne => {
                                                                    if (foundOne === null || foundOne.length < 1) {
                                                                        // save the lookup
                                                                        const teamLeaderLookup = new lookups({
                                                                            _id: mongoose.Types.ObjectId(),
                                                                            email: req.userData.email,
                                                                            teamName: req.body.teamName,
                                                                            teamLeader: "yes",
                                                                            requests: []
                                                                        });
                                                                        teamLeaderLookup
                                                                            .save()
                                                                            .then((savedResult) => {
                                                                                bcrypt.hash(req.body.teamPass, 10, (err, hash) => {
                                                                                    if (err) {
                                                                                        console.log(err);
                                                                                        return res.status(500).json({
                                                                                            status: 'fail',
                                                                                            message: err
                                                                                        });
                                                                                    } else {
                                                                                        let memberArray = [];
                                                                                        memberArray.push(req.userData.email);
                                                                                        const newTeam = new teams({
                                                                                            _id: mongoose.Types.ObjectId(),
                                                                                            teamName: req.body.teamName,
                                                                                            teamPassword: hash,
                                                                                            teamMembers: memberArray,
                                                                                        });
                                                                                        newTeam
                                                                                            .save()
                                                                                            .then(teamSaveResult => {
                                                                                                return res.status(200).json({
                                                                                                    status: 'success',
                                                                                                    message: 'Team Successfully registered.All users verified. A request has been sent to all the members. Further details can be viewed in your profile.'
                                                                                                });
                                                                                            })
                                                                                            .catch(err => {
                                                                                                console.log(err);
                                                                                                return res.status(500).json({
                                                                                                    status: 'fail',
                                                                                                    message: err
                                                                                                })
                                                                                            });
                                                                                    }
                                                                                });

                                                                            })
                                                                            .catch(err => {
                                                                                console.log(err);
                                                                                return res.status(500).json({
                                                                                    status: 'fail',
                                                                                    message: err
                                                                                });
                                                                            });
                                                                    } else {
                                                                        // update the lookup
                                                                        lookups
                                                                            .update({
                                                                                email: req.userData.email
                                                                            }, {
                                                                                $set: {
                                                                                    //email: req.userData.email,
                                                                                    teamName: req.body.teamName,
                                                                                    teamLeader: "yes",
                                                                                    requests: []
                                                                                }
                                                                            })
                                                                            .then((savedResult) => {
                                                                                bcrypt.hash(req.body.teamPass, 10, (err, hash) => {
                                                                                    if (err) {
                                                                                        console.log(err);
                                                                                        return res.status(500).json({
                                                                                            status: 'fail',
                                                                                            message: err
                                                                                        });
                                                                                    } else {
                                                                                        let memberArray = [];
                                                                                        memberArray.push(req.userData.email);
                                                                                        const newTeam = new teams({
                                                                                            _id: mongoose.Types.ObjectId(),
                                                                                            teamName: req.body.teamName,
                                                                                            teamPassword: hash,
                                                                                            teamMembers: memberArray,
                                                                                        });
                                                                                        newTeam
                                                                                            .save()
                                                                                            .then(teamSaveResult => {
                                                                                                return res.status(200).json({
                                                                                                    status: 'success',
                                                                                                    message: 'Team Successfully registered.All users verified. A request has been sent to all the members. Further details can be viewed in your profile.'
                                                                                                });
                                                                                            })
                                                                                            .catch(err => {
                                                                                                console.log(err);
                                                                                                return res.status(500).json({
                                                                                                    status: 'fail',
                                                                                                    message: err
                                                                                                })
                                                                                            });
                                                                                    }
                                                                                });

                                                                            })
                                                                            .catch(err => {
                                                                                console.log(err);
                                                                                return res.status(500).json({
                                                                                    status: 'fail',
                                                                                    message: err
                                                                                });
                                                                            });
                                                                    }
                                                                })
                                                                .catch(err => {
                                                                    console.log(err);
                                                                    res.status(500).json({
                                                                        status: 'fail',
                                                                        message: err
                                                                    });
                                                                });

                                                        }
                                                    })
                                                    .catch(err => {
                                                        console.log('sds');
                                                        console.log(err);
                                                        return res.status(500).json({
                                                            status: 'fail',
                                                            message: err
                                                        });
                                                    });
                                            } else {
                                                lookups
                                                    .update({
                                                        email: participant
                                                    }, {
                                                        $set: {
                                                            teamName: "",
                                                        },
                                                        $addToSet: {
                                                            requests: req.body.teamName
                                                        }
                                                    })
                                                    .exec()
                                                    .then((requestuser) => {
                                                        console.log("request sent to user : " + participant);
                                                        if (i === req.body['teamMembers[]'].length - 2) {
                                                            lookups
                                                                .find({
                                                                    email: participant
                                                                })
                                                                .exec()
                                                                .then(foundOne => {
                                                                    if (foundOne === null || foundOne.length < 1) {
                                                                        // save the lookup
                                                                        const teamLeaderLookup = new lookups({
                                                                            _id: mongoose.Types.ObjectId(),
                                                                            email: req.userData.email,
                                                                            teamName: req.body.teamName,
                                                                            teamLeader: "yes",
                                                                            requests: []
                                                                        });
                                                                        teamLeaderLookup
                                                                            .save()
                                                                            .then((savedResult) => {
                                                                                bcrypt.hash(req.body.teamPass, 10, (err, hash) => {
                                                                                    if (err) {
                                                                                        console.log(err);
                                                                                        return res.status(500).json({
                                                                                            status: 'fail',
                                                                                            message: err
                                                                                        });
                                                                                    } else {
                                                                                        let memberArray = [];
                                                                                        memberArray.push(req.userData.email);
                                                                                        const newTeam = new teams({
                                                                                            _id: mongoose.Types.ObjectId(),
                                                                                            teamName: req.body.teamName,
                                                                                            teamPassword: hash,
                                                                                            teamMembers: memberArray,
                                                                                        });
                                                                                        newTeam
                                                                                            .save()
                                                                                            .then(teamSaveResult => {
                                                                                                return res.status(200).json({
                                                                                                    status: 'success',
                                                                                                    message: 'Team Successfully registered.All users verified. A request has been sent to all the members. Further details can be viewed in your profile.'
                                                                                                });
                                                                                            })
                                                                                            .catch(err => {
                                                                                                console.log(err);
                                                                                                return res.status(500).json({
                                                                                                    status: 'fail',
                                                                                                    message: err
                                                                                                })
                                                                                            });
                                                                                    }
                                                                                });

                                                                            })
                                                                            .catch(err => {
                                                                                console.log(err);
                                                                                return res.status(500).json({
                                                                                    status: 'fail',
                                                                                    message: err
                                                                                });
                                                                            });
                                                                    } else {
                                                                        // update the lookup
                                                                        lookups
                                                                            .update({
                                                                                email: req.userData.email
                                                                            }, {
                                                                                $set: {
                                                                                    //email: req.userData.email,
                                                                                    teamName: req.body.teamName,
                                                                                    teamLeader: "yes",
                                                                                    requests: []
                                                                                }
                                                                            })
                                                                            .then((savedResult) => {
                                                                                bcrypt.hash(req.body.teamPass, 10, (err, hash) => {
                                                                                    if (err) {
                                                                                        console.log(err);
                                                                                        return res.status(500).json({
                                                                                            status: 'fail',
                                                                                            message: err
                                                                                        });
                                                                                    } else {
                                                                                        let memberArray = [];
                                                                                        memberArray.push(req.userData.email);
                                                                                        const newTeam = new teams({
                                                                                            _id: mongoose.Types.ObjectId(),
                                                                                            teamName: req.body.teamName,
                                                                                            teamPassword: hash,
                                                                                            teamMembers: memberArray,
                                                                                        });
                                                                                        newTeam
                                                                                            .save()
                                                                                            .then(teamSaveResult => {
                                                                                                return res.status(200).json({
                                                                                                    status: 'success',
                                                                                                    message: 'Team Successfully registered.All users verified. A request has been sent to all the members. Further details can be viewed in your profile.'
                                                                                                });
                                                                                            })
                                                                                            .catch(err => {
                                                                                                console.log(err);
                                                                                                return res.status(500).json({
                                                                                                    status: 'fail',
                                                                                                    message: err
                                                                                                })
                                                                                            });
                                                                                    }
                                                                                });

                                                                            })
                                                                            .catch(err => {
                                                                                console.log(err);
                                                                                return res.status(500).json({
                                                                                    status: 'fail',
                                                                                    message: err
                                                                                });
                                                                            });
                                                                    }
                                                                })
                                                                .catch(err => {
                                                                    console.log(err);
                                                                    res.status(500).json({
                                                                        status: 'fail',
                                                                        message: err
                                                                    });
                                                                });

                                                        }
                                                    })
                                                    .catch(err => {
                                                        console.log(err);
                                                        return res.status(500).json({
                                                            status: 'fail',
                                                            message: err
                                                        });
                                                    });
                                            }
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            return res.status(500).json({
                                                status: 'fail',
                                                message: err
                                            });
                                        });
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                return res.status(500).json({
                                    status: 'fail',
                                    message: err
                                });
                            });
                    }
                
            } else {
                return res.status(200).json({
                    status: 'fail',
                    message: "Team with the same name already exists!!"
                });
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                status: 'fail',
                message: err
            });
        });
});




router.get('/acceptRequest/:teamN', checkAuth, (req, res, next) => {
    const teamRequestAccept = req.params.teamN;
    teams
        .find({ teamName: teamRequestAccept })
        .exec()
        .then(teamSearchResult => {
            if(teamSearchResult === null || teamSearchResult.length < 1) {
                lookups
                    .update({ 
                        email : req.userData.email 
                    },{
                        $pull : { requests : teamRequestAccept }
                    })
                    .exec()
                    .then((requestDelete) => {
                        console.log('Team without leader removed.');
                        res.status(200).json({
                            status: 'success',
                            message: 'Hanging out team removed.'
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).json({
                            status: 'fail',
                            message: err
                        });
                    });

            } else {
                console.log("Team Found!");
                    lookups
                        .update({
                            email: req.userData.email
                        }, {
                            $set: {
                                teamName: teamRequestAccept,
                                requests: []
                            }
                        })
                        .exec()
                        .then((result) => {
                            console.log('Request accepted.Lookup updated.');
                            teams
                                .update({
                                    teamName: teamRequestAccept
                                }, {
                                    $addToSet: {
                                        teamMembers: req.userData.email
                                    }
                                })
                                .then((team) => {
                                    console.log('Team updated.');
                                    res.status(200).json({
                                        status: 'success',
                                        message: 'You are added to Team ' + teamRequestAccept
                                    });
                                })
                                .catch((err) => {
                                    console.log(err);
                                    res.status(500).json({
                                        status: 'fail',
                                        message: err
                                    });
                                });
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(500).json({
                                status: 'fail',
                                message: err
                            });
                        });
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                status: 'fail',
                message: err
            });
        });
    
});

router.get('/deleteRequest/:teamN', checkAuth, (req, res, next) => {
    const teamRequestRemove = req.params.teamN;
    lookups
        .update({
            email: req.userData.email
        }, {
            $pull: {
                requests: teamRequestRemove
            }
        })
        .exec()
        .then((result) => {
            console.log('Request deleted.Lookup updated.');
            return res.status(200).json({
                status: 'success',
                message: 'Request Deleted'
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                status: 'fail',
                message: err
            });
        })
});


router.get('/deleteMember/:teamN/:ema',checkAuth,(req, res, next) => {
    const teamEdit = req.params.teamN;
    const memberEmail = req.params.ema;
    teams
        .update({
            teamName : teamEdit
        }, {
            $pull : { teamMembers : memberEmail }
        })
        .exec()
        .then((result) => {
            console.log('Team edited');
            lookups
                .update({
                    email : memberEmail
                }, {
                    $set : {
                        teamName : "",
                        teamPoints : 0
                    }
                })
                .exec()
                .then((look) => {
                    console.log('Lookup edited');
                    return res.status(200).json({
                        status: 'success',
                        message: "Team Member with email "+memberEmail+" has been removed."
                    });
                })
                .catch((err) => {
                    console.log(error);
                    res.status(500).json({
                        status: 'fail',
                        message: error
                    });
                });
        })
        .catch((err) => {
            console.log(error);
            res.status(500).json({
                status: 'fail',
                message: error
            });
        });
});

router.delete('/deleteTeam/:teamN', checkAuth, (req, res, next) => {
    const teamDelete = req.params.teamN;
    let countUpdates = 0;
    teams
        .findOneAndDelete({ teamName : teamDelete})
        .exec()
        .then((deletedDoc) => {
            if(deletedDoc === null){
                console.log('Team not present');
                return res.status(200).json({
                    status: 'fail',
                    message: 'No team present by this name.'
                });
            } else {
                console.log('Team Deleted.Now lookups will be updated');
                console.log(deletedDoc);
                for (let i = 0; i < deletedDoc['teamMembers'].length; i++) {
                    const teamMember = deletedDoc['teamMembers'][i];
                    lookups
                        .update({
                            email: teamMember
                        }, {
                            $set: {
                                teamName: "",
                                teamPoints: 0,
                                teamLeader: "no"
                            }
                        })
                        .exec()
                        .then((result) => {
                            console.log('Member lookup updated');
                            countUpdates = countUpdates + 1;
                            if (i === deletedDoc['teamMembers'].length - 1 || countUpdates === deletedDoc['teamMembers'].length) {
                                return res.status(200).json({
                                    status: 'success',
                                    message: 'Team Deleted successfully.'
                                });
                            } else {
                                console.log("Team is still being deleted!");
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

router.post('/eventRegister', (req, res, next) => {
    teams
        .find({
            teamName: req.body.teamName
        })
        .exec()
        .then((team) => {
            if (team === null || team.length < 1) {
                res.status(200).json({
                    status: "fail",
                    message: "No such Team Present! Register your Team First."
                });
            } else {
                bcrypt.compare(req.body.password, team[0].teamPassword, (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({
                            status: 'fail',
                            message: err
                        })
                    } else {
                        if (result) {
                            if (team[0].eventsRegistered % req.body.eventValue == 0) {
                                res.status(200).json({
                                    status: "fail",
                                    message: "Team is already registered in this event"
                                });
                            } else {
                                teams
                                    .update({
                                        teamName: team[0].teamName
                                    }, {
                                        $mul: {
                                            eventsRegistered: req.body.eventValue
                                        }
                                    })
                                    .exec()
                                    .then((teamResult) => {
                                        console.log(teamResult);
                                        res.status(200).json({
                                            status: 'success',
                                            message: "Team registered for event!"
                                        });
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                        res.status(500).json({
                                            status: 'fail',
                                            message: error
                                        });
                                    });
                            }
                        } else {
                            return res.status(200).json({
                                status: 'fail',
                                message: 'Password Matching Error'
                            });
                        }
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

// router.get('/events', (req, res, next) => {
//     res.status(200).json({
//         status: 'success',
//         message: "Events Data retrieval successful",
//         events: Events
//     });
// });

// router.get('/events/:eventName', (req, res, next) => {
//     const event = req.params.eventName;
//     const eventData = Events[event];
//     res.status(200).json({
//         status: "success",
//         message: "Event " + event + " fetched successfully",
//         event: eventData
//     });
// });

module.exports = router;

// router.post('/fetchTeam', checkAuth, (req, res, next) => {
//     lookups
//         .find({ email: req.userData.email })
//         .exec()
//         .then((result) => {
//             if(result === null || result.length < 1){

//                     users
//                         .find({
//                             email: result[0].email
//                         })
//                         .exec()
//                         .then((user) => {
//                             if (user === null || user.length < 1) {
//                                 res.status(200).json({
//                                     status: 'fail',
//                                     message: "user not found! Can't make Team"
//                                 });
//                             } else {
//                                 res.status(200).json({
//                                     status: 'success',
//                                     message: 'Team is not yet Registered.',
//                                     email: user[0].email,
//                                     panId: user[0].panId
//                                 });
//                             }
//                         })
//                         .catch(err => {
//                             res.status(500).json({
//                                 message: err
//                             });
//                         });
//             } else {

//                 teams
//                     .find({ teamName: result[0].teamName })
//                     .exec()
//                     .then((teamdetails) => {
//                         if(teamdetails === null || teamdetails.length < 1) {
//                             res.status(200).json({
//                                 status: 'fail',
//                                 message: "team details not found!"
//                             });
//                         } else {
//                             res.status(200).json({
//                                 status: 'success',
//                                 message: "Team details found! You have already been registered",
//                                 team : teamdetails[0]
//                             });
//                         }
//                     })
//                     .catch(err => {
//                         res.status(500).json({
//                             message: err
//                         });
//                     });
//             }
//         })
//         .catch(err => {
//             res.status(500).json({
//                 message: err
//             });
//         });
// });
// router.get('/verifyMember',(req, res, next) => {
//     lookups
//         .find({ email : req.body.email })
//         .exec()
//         .then((result) => {
//             if(result === null || result.length < 1){
//                 res.status(200).json({
//                     status: 'success',
//                     message: "Allowed"
//                 });
//             }
//             else{
//                 res.status(200).json({
//                     status: 'fail',
//                     message: "User already in a team!"
//                 });
//             }
//         })
//         .catch((err) => {
//             res.status(500).json({
//                 message: err
//             });
//         });
// });
// router.post('/teamRegister', checkAuth ,(req, res, next) => {
//     teams
//         .find({ teamName : req.body.teamName })
//         .exec()
//         .then((team) => {
//             if(team && team.length>=1){
//                 res.status(200).json({
//                     status: "exists",
//                     message: "This Team Name already exists!!"
//                 });
//             }
//             else{
//                 bcrypt.hash(req.body.teamPassword, 10, (err, hash) => {
//                     if (err) {
//                         res.status(500).json({
//                             status: "fail",
//                             message: err
//                         });
//                     } else {
//                         const newTeam = new teams({
//                             _id: mongoose.Types.ObjectId(),
//                             teamName: req.body.teamName,
//                             teamPassword: hash,
//                             teamMembers: req.body.teamMembers
//                         });
//                         newTeam
//                             .save()
//                             .then((result) => {
//                                 console.log(result);
//                                 res.status(200).json({
//                                     status: "success",
//                                     message: "Team registered!!"
//                                 });
//                             })
//                             .catch((err) => {
//                                 console.log(err);
//                                 res.status(500).json({
//                                     status: "fail",
//                                     message: err
//                                 });
//                             });
//                     }
//                 });
//             }
//         })
//         .catch((err) => {
//             console.log(err);
//             res.status(500).json({
//                 status: "fail",
//                 message: err
//             });
//         });
// });
