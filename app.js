require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const router = require('./Route/Route')
const app = express()


app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api', router)
app.use('/', (req, res) => {
    res.send('404')
})



mongoose.connect('mongodb+srv://Tapan:Tapan123@cluster0.sn1se5u.mongodb.net/Tapan_auth')
    .then(() => { console.log("mongodb connected"); })
    .catch((err) => { console.log(err); })

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))