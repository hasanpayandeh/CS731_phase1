// Handling requests related to Users colletion

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');

const Users = require("../model/usersModel");


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}


router.get('/ownerslist', asyncHandler(async (req, res) => {
    const ownerslist = await Users.find({signuptype: "owner"}).select("-password");
    res.status(200).json(ownerslist);
}));

router.get('/ownerinfo/:id', asyncHandler(async (req, res) => {
    const ownerslist = await Users.find({_id: req.params.id}).select("-password");
    res.status(200).json(ownerslist);
}));

router.post('/login', asyncHandler(async (req, res) => {
    const {signuptype, username, password, email} = req.body;

    if(!username) {
        res.status(400).json({"error": "Username is required"});
    } else if(!password) {
        res.status(400).json({"error": "Password is required"});
    }

    var user = await Users.findOne({username});

    if(!user && !email) {
        user = await Users.findOne({email: username});
    }

    if(user && (password==user.password)) {
        res.status(201).json({
            "_id": user._id,
            "signuptype": user.signuptype,
            "username": user.username,
            "email": user.email,
            "name": user.name
        });
    }
    else
    {
        res.status(400).json({"error": "Invalid credentials"});
    }
}));

router.post('/signup', asyncHandler(async (req, res) => {
    const {signuptype, username, password, repassword, name, email} = req.body;

    if(!signuptype) {
        res.status(400).json({"error": "Signup Type is required"});
    } else if(!username) {
        res.status(400).json({"error": "Username is required"});
    } else if(!password) {
        res.status(400).json({"error": "Password is required"});
    } else if(!repassword) {
        res.status(400).json({"error": "Confirm Password is required"});
    } else if(password!=repassword) {
        res.status(400).json({"error": "Password and Confirm Password do not match."});
    }

    const userExists = await Users.findOne({username});
    const emailExists = await Users.findOne({email});

    if(userExists) {
        res.status(400).json({"error": "Username already exists. Try another one"});
    } else if(email!=""&&email!=null&&emailExists) {
        res.status(400).json({"error": "Email already exists. Try another one"});
    } else {
        
        const user = await Users.create({
            signuptype: signuptype,
            username: username,
            password: password,
            email: email,
            name: name
        });

        if(user) {
            res.status(201).json({
                "_id": user._id,
                "signuptype": user.signuptype,
                "username": user.username,
                "email": user.email,
                "name": user.name
            });
        } else {
            res.status(400).json({"error": "There is a problem with your sign up request"});
        }
        
    }
}));

module.exports = router