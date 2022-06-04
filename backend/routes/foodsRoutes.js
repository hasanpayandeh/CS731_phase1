// Handling requests related to Foods colletion

const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const Foods = require("../model/foodsModel");
const Users = require("../model/usersModel");

router.post('/add', asyncHandler(async (req, res) => {
    const {title, desc, ownerId} = req.body;

    if(!title) {
        res.status(400).json({"error": "Title is required"});
    } else if(!ownerId) {
        res.status(400).json({"error": "ownerId is required"});
    }

    const ownerExists = await Users.findOne({_id: ownerId, signuptype: "owner"});
    const foodExists = await Foods.findOne({ownerId: ownerId, title: title});

    if(!ownerExists) {
        res.status(400).json({"error": "Owner does not exists or you are not an owner"});
    } else if(foodExists) {
        res.status(400).json({"error": "You added a same post before"});
    } else {
        const food = await Foods.create({
            title: title,
            desc: desc,
            ownerId: ownerId
        });

        if(food) {
            res.status(201).json({
                "_id": food._id,
                "ownerId": food.ownerId,
                "title": food.title,
                "desc": food.desc
            });
        } else {
            res.status(400).json({"error": "There is a problem with your add post request"});
        }
        
    }
}));

module.exports = router