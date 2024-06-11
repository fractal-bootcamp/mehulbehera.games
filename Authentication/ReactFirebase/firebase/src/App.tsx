import { useState } from "react";
import "./App.css";
import "../index.css";

import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { initializeApp } from "firebase/app";

//CHECK IF YOU NEED TO ADD THE .TS - CREATES AN ERROR
import { firebaseConfig } from "../firebase.config";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  const [inputEmail, setEmail] = useState("");
  const [inputPassword, setPassword] = useState("");

  const [inputedEmail, setInputedEmail] = useState("");
  const [inputedPassword, setInputedPassword] = useState("");

  //handle register pressed
  function register() {
    console.log("inputedEmail", inputedEmail);
    console.log("inputedPassword", inputedPassword);
    createUserWithEmailAndPassword(auth, inputedEmail, inputedPassword)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }

  //handle login pressed
  function login() {
    console.log("inputedEmail", inputedEmail);
    console.log("inputedPassword", inputedPassword);
    signInWithEmailAndPassword(auth, inputedEmail, inputedPassword)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  return (
    <div>
      <div className="flex flex-col">
        <label>
          Enter email:{" "}
          <input
            name="EmailInput"
            placeholder=""
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Enter password:{" "}
          <input
            name="Password"
            placeholder=""
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      <div>
        <button
          className="btn"
          onClick={() => {
            //setting inputed email/pass components
            setInputedEmail(inputEmail);
            setInputedPassword(inputPassword);

            //VALIDATE LOGIN
            login();
          }}
        >
          Login
        </button>
        <button
          className="btn"
          onClick={() => {
            //setting inputed email/pass components
            setInputedEmail(inputEmail);
            setInputedPassword(inputPassword);

            //Register
            register();
          }}
        >
          Register
        </button>
      </div>
      <div>Current Login Email: {inputedEmail}</div>
      <div>Current Login Password: {inputedPassword}</div>
    </div>
  );
}

export default App;
