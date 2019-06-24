const express = require("express")
const users = require("../database/db").users
const projects = require("../database/db").contributions
const pictures = require("../database/db").pictures

const { Helper } = require("../utils/index")
const { checkToken } = require("../middleware/checkToken")

const router = new express.Router()

// API from which we load our user profile
router.get("/", checkToken, (req, res) => {
    const { id } = req.decoded
    users.select("*")
        .from("users")
        .where({ user_id: id })
        .then(user => {
            res.json(user[0])
        })
})

// Our logging in and registering API works with signed JWT's. This could be secured more in
// in the future using JWE or another technique.

// Login API
router.post("/login", (req, res) => {
    const { email, password } = req.body

    // Check if email and password are provided
    if(email && password){
        // Check if the provided e-mail exist otherwise crashes on non-existing email
        try{
            Promise.resolve(users.select('email')
                .from('users')
                .where({'email': email}))
                .then(data => {
                    if(data.length > 0) {
                        try {
                            users("user_login")
                                .where({ email: email })
                                .select()
                                .then(rows => {
                                    // Check if emails and passwords match
                                    if (
                                        email === rows[0].email &&
                                        Helper.comparePassword(rows[0].hashpass, password)
                                    ) {
                                        // Generate JWT and send it to the user.
                                        return users
                                            .select("*")
                                            .from("users")
                                            .where({ email: email })
                                            .then(user => {
                                                const {
                                                    publicToken,
                                                    privateToken,
                                                } = Helper.generateToken(user[0].user_id)
                                                res.cookie("teambuildPublic", publicToken)
                                                res.cookie("teambuildPrivate", privateToken, {
                                                    httpOnly: true,
                                                })
                                                res.json({
                                                    user: user[0],
                                                    message: "Login successful",
                                                })
                                            })
                                    } else {
                                        res.status(400).send({ message: "Provided incorrect login details" })
                                    }
                                })
                        } catch (e) {
                            res.status(400).send({ message: "A problem occured when trying to load your account" })
                        }
                    }else{
                        res.status(400).send({message: "Provided incorrect login details"})
                    }
                })
        } catch (e) {
            res.status(400).send({message: "Database is not available, please try again later"})
        }
    }else{
        res.status(400).send({message: "Please provide your E-mail and password"})
    }
})

// Register API
router.post("/register", (req, res) => {
    const { email, password, first_name, last_name } = req.body

    // Check if email and password are present
    if (!email || !password || !first_name || !last_name) {
        return res.status(400).send({
            message: "Email, password, first name or last name is missing.",
        })
    }

    // Check if email input is valid
    if (!Helper.isValidEmail(email)) {
        return res
            .status(400)
            .send({ message: "Incorrect email format has been given." })
    }

    // Hash input password
    const hashedPassword = Helper.hashPassword(password)

    // Insert user into "users" table with required empty fields if email not existing
    try {
        Promise.resolve(
            users
                .select("email")
                .from("users")
                .where({ email: email })
                .then(data => {
                    if (data.length !== 0) {
                        return res
                            .status(400)
                            .send({ message: "Email already exist" })
                    } else {
                        users.transaction(trx => {
                            return (
                                trx
                                    .insert({
                                        email: email,
                                        first_name: first_name,
                                        last_name: last_name,
                                        joined: new Date(),
                                        isadmin: false
                                    })
                                    // Insert user into "user_login" table with email and password input
                                    .into("users")
                                    .then(() =>
                                        trx("user_login").insert({
                                            email: email,
                                            hashpass: hashedPassword,
                                        })
                                    )
                            )
                        })
                        res.json({
                            message: "Registration successful",
                        })
                    }
                })
        )
    } catch (e) {
        res.status(400).send({ errorMessage: "Incorrect details entered." })
    }
})


module.exports = router
