const express = require("express")
const dotenv = require("dotenv").config()
const logger = require("morgan")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const nodemailer = require("nodemailer")

const userRoutes = require("./routes/userRoutes")

const app = express()
const L_PORT = 5000

app.use(logger(":date[iso]"))
app.use(logger("dev"))
app.use(logger(":user-agent"))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())

// Routes


// nodemailer route for the apply URL
app.post('/apply', (req, res) => {
   let output = `
    <p> New application</p>
    <h3>Form details</h3>
    <ul>
        <li> Email: ${req.body.email} </li>
        <li> Name: ${req.body.name} </li>
        <li> GitHub Name: ${req.body.githubName} </li>
        <li> Role: ${req.body.role} </li>
        <li> Stack: ${req.body.stack} </li>
        <li> join Reason: ${req.body.joinReason} </li>
    </ul>
   `
        async function main(){

            // Generate test SMTP service account from ethereal.email
            // Only needed if you don't have a real mail account for testing
            let testAccount = await nodemailer.createTestAccount();
                    
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass // generated ethereal password
                }
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
            from: 'chandlerbaskins@yahoo.com', // sender address
            to: "baskinschandler@gmail.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: output // html body
            });
        
            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        
            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        }
        
        main().catch(console.error);
            
        
})



app.use("/user", userRoutes)

app.get("/test", (req, res) => {
    res.send("You're using the API correctly. :)")
})

app.listen(process.env.PORT || L_PORT, () => {
    console.log(`Server is running on port ${L_PORT}`)
})
