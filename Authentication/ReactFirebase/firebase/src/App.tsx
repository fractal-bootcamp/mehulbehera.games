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

//takes in Request with params (input, config) then adds the token to the config headers
//this gets put in a fetch which means it goes to the backend
function sendAuthorizedRequest(
  input: string | URL | globalThis.Request,
  config?: RequestInit
) {
  const token = auth.currentUser?.getIdToken();
  if (config?.headers) {
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  }
  //send token to server
  return fetch(input, config);
}

function App() {
  const [inputEmail, setEmail] = useState("");
  const [inputPassword, setPassword] = useState("");

  //handle register pressed
  function register() {
    const email = inputEmail;
    const password = inputPassword;
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed up
        const user = userCredential.user;
        const response = await sendAuthorizedRequest(
          "http://localhost:3005/user",
          { method: "POST", body: JSON.stringify({}) }
        );
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
    const email = inputEmail;
    const password = inputPassword;
    signInWithEmailAndPassword(auth, inputEmail, inputPassword)
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

            //Register
            register();
          }}
        >
          Register
        </button>
      </div>
      <div>Current Login Email: {inputEmail}</div>
      <div>Current Login Password: {inputPassword}</div>
    </div>
  );
}

export default App;
