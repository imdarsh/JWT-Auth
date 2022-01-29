const express =  require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./db/connect');
const userModel = require('./model/user');
const bcrypt = require('bcryptjs');
const { rmSync } = require('fs');
const jwt = require('jsonwebtoken');

// const JWT_SECRET = 'Qs12kfVC389Hkuhfeiu9OEF9lIFHO#$%^834RH8h98hoiefoih8whtiro@#$%^&*()ehgo8o4hjltsijsgp94'
app.use('/',express.static(path.join(__dirname,'static')));
app.use(bodyParser.json());

app.post('/api/login', async (req,res) => {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username }).lean();

    if(!user){
        res.json({ status: 'error', error: 'Invalid Username/Password' });
    }

    if(await bcrypt.compare(password, user.password)){
        const token = jwt.sign({
            id: user._id,
            username: user.username
        }, process.env.JWT_SECRET);
        return res.json({ status: 'ok', data: token });
    }
     res.json({ status: 'error', error: 'Invalid Username/Password' });
    
});

app.post('/api/register', async (req,res) => {
    const { username, password: plainTextPassword } = req.body;
    const password = await bcrypt.hash(plainTextPassword, 10);
    try{
        const response = await userModel.create({
            username,
            password
        });
        console.log('User created Successfully', response);

        res.json({ status: 'OKAY' })
    }
    catch(error){
        if(error.code === 11000){
            return res.json({ status: 'error', error: 'Username already exists' });
        }
        throw error; 
    }
}); 

const port = 3000;

const start = async () => {
    try{
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is running at port ${port}...`));
    }
    catch(error){
        console.log(error);
    }
}

start();