const express = require('express');
const app = express()
const port = 3000
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


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
//make get page a login page
//once user input login info (POST)
//send to dashboard page
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

app.post('/login', (req, res) => {
    // Insert Login Code Here
    const user = users.find(user => ((user.email === req.body.email) && (user.password === req.body.password)));
    if (user) {
        console.log("SUCCESS");
        console.log("Email", req.body.email);
        console.log("Password", req.body.password);
        res.cookie("loggedin", "true");
        res.send("SUCCESS");
    }
    else {
        console.log("FAILED");
        console.log("Email", req.body.email);
        console.log("Password", req.body.password);
        res.send("failed login");
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

// app.post('/', (req, res) => {
//     console.log("*****REQ BODY******");
//     console.log(req.body);
//     console.log("*****REQ BODY******");
//     console.log("*****REQ Email******");
//     console.log(req.body.email);
//     console.log("*****REQ Email******");
//     console.log("*****REQ Password******");
//     console.log(req.body.password);
//     console.log("*****REQ Password******");
//     const user = users.find(user => ((user.email === req.body.email) && (user.password === req.body.password)));
//     if (user) {
//         console.log("SUCCESS");
//         res.send("SUCCESS");
//     }
//     else {
//         console.log("FAILED");
//         res.send("failed login");
//     }
// });