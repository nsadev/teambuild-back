const express = require("express")
const dotenv = require("dotenv").config()
const logger = require("morgan")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const nodemailer = require("nodemailer")
const projects = require("./database/db").contributions

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

            
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                user: process.env.TEAMBUILDEMAIL, // generated ethereal user
                pass: process.env.TEAMBUILDPASSWORD // generated ethereal password
                }
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
            from: 'chandlerbaskins@yahoo.com', 
            to: "teambuild2019adm@gmail.com", 
            subject: "Hello ✔", 
            text: "Hello world?", 
            html: output 
            });
        
            console.log("Message sent: %s", info.messageId);
           
        
           
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
           
        }
        
        main().catch(console.error);
            
        
})

// Sending all projects from DB
app.get("/projects", (req, res) => {
    projects.select("*")
        .from("project")
        .then(prj => {
            res.json(prj)
        })
})

app.use("/user", userRoutes)

app.get("/test", (req, res) => {
    res.send("You're using the API correctly. :)")
})

app.listen(process.env.PORT || L_PORT, () => {
    console.log(`Server is running on port ${L_PORT}`)
})
