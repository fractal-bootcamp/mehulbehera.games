const express = require('express');
const app = express()
const port = 3003
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


const users = [
    {
        id: 1,
        email: "nancy@gmail.com",
        password: "baseball"
    },
    {
        id: 2,
        email: "greg@gmail.com",
        password: "ilovebaseball"
    },
];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/login', (req, res) => {
    if(req.cookies.loggedin == "true"){

        res.send("Success")

    }
    else{

        res.sendFile(__dirname + '/public/login.html');
        
    }
});

app.post('/dashboard', (req, res) => {
    //res.sendFile(__dirname + '/public/dashboard.html');
    res.send("SUCCESS");
});

async function getUser(userEmail:string,userPassword:string){

    return await prisma.user.findUnique({

        where: {

            email: userEmail,
            password: userPassword

        }
        
    })


}

app.post('/login', async (req, res) => {
    // Insert Login Code Here
    const email = req.body.email
    const password = req.body.password
    console.log(email)
    console.log(password)
    
    //const user = users.find(user => ((user.email === req.body.email) && (user.password === req.body.password)));
    const user = await getUser(email,password)
    console.log(user)
    if (!(user==null)) {
        res.cookie("loggedin", "true");
        res.send("SUCCESS");
    }
    else {
        res.send("failed login");
    }
});

app.get('/register', (req, res) => {
    
    console.log(" Ran Register get")
    res.sendFile(__dirname + '/public/register.html');
        
    
});

async function createUser(userEmail:string, userPass:string){

    const user = await prisma.user.upsert({

        where: {

            email: userEmail,
            

        },
        update: {

            password:userPass

        },
        create:{

            email:userEmail,
            password: userPass
        }

    })

}

app.post('/register', (req, res) => {
    //take input and add to database - send to login page after
    const emailFromRequest = req.body.email;
    const passwordFromRequest = req.body.password;

    createUser(emailFromRequest, passwordFromRequest)

    console.log(" Ran Register Post")

    res.sendFile(__dirname + '/public/login.html');


    
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
