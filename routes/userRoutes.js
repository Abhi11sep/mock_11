const express = require('express')
const userRouter = express.Router()
const bcrypt = require('bcrypt')
const { UserModel } = require('../models/userModel')
const jwt = require('jsonwebtoken')

userRouter.get("/", (req, res) => {
    res.send("WELCOME IN AUTHENTICATION PORTAL")
})

userRouter.post("/register", async (req, res) => {
    const { Profile_picture, Name, Bio, Phone, Email, Password } = req.body;
    try {
        bcrypt.hash(Password, 2, async (err, hash) => {
            if (err) {
                console.log("unable to hash password", err)
            }
            const user = new UserModel({ Profile_picture, Name, Bio, Phone, Email, Password: hash })
            await user.save()
            console.log("resgistered")
            res.status(201).send()
        });

    } catch (error) {
        res.send("unable to register", error)
    }
})

userRouter.post("/login", async (req, res) => {
    const { Email, Password } = req.body;
    try {
        const user = await UserModel.find({ Email })
        console.log(user)
        if (user.length > 0) {
            bcrypt.compare(Password, user[0].Password, function (err, result) {
                if (result) {
                    const token = jwt.sign({ userID: user[0]._id }, 'masai');
                    console.log(`logged in,welcome : ${user[0].Name},\n token : ${token}`)
                    res.send({ "msg": "logged in", "token": `${token}` })
                } else {
                    res.send("wrong credentials")
                }
            });
        } else {
            res.send("login first")
        }
    } catch (error) {
        res.send("error while login")
    }
})

userRouter.use("/getProfile", async (req, res) => {
    try {
        let users = await UserModel.find();
        res.send(users)
    } catch (error) {
        res.send("uanble to load users")
    }
})

userRouter.patch("/user/:id", async (req, res) => {
    const payload = req.body;
    const ID = req.params.id
    try {
        await UserModel.findByIdAndUpdate({ "_id": ID }, payload)
        res.send()
    } catch (error) {
        res.send("uanble to load users", error)
    }
})


module.exports = { userRouter }
