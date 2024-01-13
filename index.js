require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const errorMiddlewair = require('./middleware/error');
const app = express();
const product = require('./routes/productRoute');
const user = require('./routes/userRoute');
const db = require('./config/db');


app.use(express.json());
app.use(cookieParser());
//middlewaire for error
app.use(errorMiddlewair)

app.use('/api/v1/',product);
app.use('/api/v1/',user);

app.listen(process.env.PORT,()=>{
    console.log(`server is working on http:/localhost:${process.env.PORT}`);
});