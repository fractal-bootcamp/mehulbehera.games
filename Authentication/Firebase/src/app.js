// const express = require('express');
// const cookieParser = require('cookie-parser');
// require("dotenv").config();
// const port = process.env.PORT || 8080;
// var bodyParser = require('body-parser')

// // const firebase = require('firebase');
// // var firebaseConfig = {
// //     apiKey: "AIzaSyAQ5BkWG6aj0K_Z9P7GWUXR--nKPyMsI7I",
// //     authDomain: "express-authenification.firebaseapp.com",
// //     projectId: "express-authenification",
// //     storageBucket: "express-authenification.appspot.com",
// //     messagingSenderId: "969564837070",
// //     appId: "1:969564837070:web:e3b72fb17d470c80d1ac9f"
// // };
// // // Initialize Firebase
// // firebase.initializeApp(firebaseConfig);


// const app = express()


// app.use(bodyParser.urlencoded({ extended: true }));

// const users = [
//     {
//         id: 1,
//         email: "nancy@gmail.com",
//         password: "baseball"
//     },
//     {
//         id: 2,
//         email: "greg@gmail.com",
//         password: "ilovebaseball"
//     },
// ];
// //make get page a login page
// //once user input login info (POST)
// //send to dashboard page
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/index.html');
// });

// app.get('/login', (req, res) => {
//     res.sendFile(__dirname + '/public/login.html');
// });

// app.post('/dashboard', (req, res) => {
//     //res.sendFile(__dirname + '/public/dashboard.html');
//     res.send("SUCCESS");
// });

// app.post('/login', (req, res) => {
//     // Insert Login Code Here

//     const user = users.find(user => ((user.email === req.body.email) && (user.password === req.body.password)));
//     if (user) {
//         console.log("SUCCESS");
//         console.log("Email", req.body.email);
//         console.log("Password", req.body.password);
//         res.send("SUCCESS");
//     }
//     else {
//         console.log("FAILED");
//         console.log("Email", req.body.email);
//         console.log("Password", req.body.password);
//         res.send("failed login");
//     }
// });

// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`);
// });

const express = require('express');
const cookieParser = require('cookie-parser');
require("dotenv").config();
const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json())
app.use(cookieParser())

const router = require("./routes");
app.use(router);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});