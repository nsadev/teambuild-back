const express = require('express');
const logger = require('morgan');


const app = express();
const L_PORT = 3000;


app.use(logger(':date[iso]'));
app.use(logger('dev'));
app.use(logger(':user-agent'));


// Routes

app.get('/', (req, res) => { res.send("TeamBuild server is running")});



app.listen(process.env.PORT || L_PORT, () => {
    console.log(`Server is running on port ${L_PORT}`)
});