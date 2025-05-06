import React from "react";
import { useState } from "react";
import SignUp from "../Components/SignUp";
import LogIn from "../Components/LogIn";

const WelcomePage = () => {
  const [newUser, setNewUser] = useState(true);
  const signUp = () => {
    setNewUser(true);
  };

  const logs = () => {
    setNewUser(false);
  };

  return (
    <>
      <div className="welcome-page">
        <div>
          {newUser ? (
            <SignUp goToLogIn={logs} />
          ) : (
            <LogIn goToSignUp={signUp} />
          )}
        </div>
      </div>
    </>
  );
};

export default WelcomePage;
