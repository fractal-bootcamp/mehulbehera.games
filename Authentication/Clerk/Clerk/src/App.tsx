import { useState } from "react";
import "./App.css";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

function App() {
  return (
    <div className="navbar bg-base-800 rounded">
      <div className="flex-1">
        <a className=" text-xl text-bold">Mehul's Portfolio</a>
      </div>
      <div className="flex">
        <div>
          <div className="btn btn-ghost  avatar">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
