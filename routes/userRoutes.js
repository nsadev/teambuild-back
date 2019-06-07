const express = require("express");

const { Helper } = require("../utils/index");
const knex = require("../database/db");
const { checkToken } = require("../middleware/checkToken");

const router = new express.Router();

// Our logging in and registering API works with signed JWT's. This could be secured more in
// in the future using JWE or another technique.

// Login API
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Look up user in db by email
  try {
    knex("user_login")
      .where({ email: email })
      .select()
      .then(rows => {
        // Check if emails and passwords match
        if (
          email === rows[0].email &&
          Helper.comparePassword(rows[0].hashpass, password)
        ) {
          // Generate JWT and send it to the user.
          const jwtToken = Helper.generateToken(email);
          res.json({
            message: "Registration successful",
            token: jwtToken
          });
        }
      });
  } catch (e) {
    res.status(400).send("Provided incorrect login details");
  }
});

// Register API
router.post("/register", (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are present
  if (!email || !password) {
    return res.status(400).send({ message: "Email or password is missing." });
  }

  // Check if email input is valid
  if (!Helper.isValidEmail(email)) {
    return res
      .status(400)
      .send({ message: "Incorrect email format has been given." });
  }

  // Hash input password
  const hashedPassword = Helper.hashPassword(password);

  // Insert user into "users" table with required empty fields
  try {
    knex.transaction(trx => {
      return (
        trx
          .insert({
            email: email,
            first_name: "",
            last_name: "",
            joined: new Date()
          })
          // Insert user into "user_login" table with email and password input
          .into("users")
          .then(() =>
            trx("user_login").insert({ email: email, hashpass: hashedPassword })
          )
      );
    });

    // Generate JWT and send it to the user.
    const jwtToken = Helper.generateToken(email);
    res.json({
      message: "Registration successful",
      token: jwtToken
    });
  } catch (e) {
    res.status(400).send({ errorMessage: "Incorrect details entered." });
  }
});

module.exports = router;
