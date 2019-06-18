const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.Helper = {
    /**
     * Hash Password Method
     * @param {string} password
     * @returns {string} returns hashed password
     */
    hashPassword(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
    },
    /**
     * comparePassword
     * @param {string} hashPassword
     * @param {string} password
     * @returns {Boolean} return True or False
     */
    comparePassword(hashPassword, password) {
        return bcrypt.compareSync(password, hashPassword)
    },
    /**
     * isValidEmail helper method
     * @param {string} email
     * @returns {Boolean} True or False
     */
    isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email)
    },
    /**
     * Generate Token
     * @param {string} id
     * @returns {string} token
     */
    generateToken(id) {
        const token = jwt.sign(
            {
                id: id,
            },
            process.env.SECRET,
            { expiresIn: "7d" }
        )
        const tokenArray = token.split(".")
        const publicToken = tokenArray[0] + "." + tokenArray[1]
        const privateToken = tokenArray[2]
        return {
            publicToken,
            privateToken,
        }
    },
}
