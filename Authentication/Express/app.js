const express = require('express');
const app = express()
const port = 3000
var bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({ extended: true }));
const users = [
    {
        id: 1,
        email: "nancy@gmail.com",
        password: "stupidpassword"
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
    //res.send('Hello From Get JS');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
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

app.post('/login', (req, res) => {
    // Insert Login Code Here
    let username = req.body.username;
    let password = req.body.password;
    res.send(`Username: ${username} Password: ${password}`);
  });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
