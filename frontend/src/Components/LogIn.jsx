import React from "react";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
} from "firebase/auth";
import { auth } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
// import SignOut from "./SignOut";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const LogIn = ({ goToSignUp }) => {
  const userDetails = {
    email: "",
    password: "",
  };
  const [logIndetails, setLogInDetails] = useState(userDetails);
  const [logInErrors, setLogInErrors] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUserTag } = useAuth();
  const [newUser, setNewUser] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLogInDetails({ ...logIndetails, [name]: value });
  };

  const handleLogIn = async (e) => {
    e.preventDefault();

    const errors = validate(logIndetails);
    setLogInErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }
    console.log(logIndetails);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        logIndetails.email,
        logIndetails.password
      );
      const user = userCredential.user;

      // Fetch user tag from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      console.log("User UID:", user.uid);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const userTag = userData.userTag;

        if (userTag) {
          toast.success("Logged In successfully");

          // 🔁 Navigate after setting storage
          setTimeout(() => {
            if (userTag === "store-manager") {
              navigate("/manager");
            } else if (userTag === "vendor") {
              navigate("/vendor");
            } else {
              navigate("/");
            }
          }, 100);
        } else {
          toast.error("No user tag found for this user.");
          console.warn("User tag is missing in Firestore data");
        }
      }

      console.log("User logged in successfully", userCredential.user);
    } catch (error) {
      setError("Invalid credentials, please check details");
      toast.error("No account found. Please Sign Up.");
      console.log(error.message);
    }
  };

  const validate = (inputs) => {
    const errors = {};

    const regex = /^[\w\.-]+@[\w-]+\.[\w-]{2,}$/;

    if (!inputs.email) {
      errors.email = "Email is required";
    } else if (!regex.test(inputs.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!inputs.password) {
      errors.password = "Password is required";
    } else if (inputs.password.length <= 4) {
      errors.password = "Password must contain more than 4 characters";
    } else if (inputs.password.length > 10) {
      errors.password = "Password must not contain more than 10 characters";
    }

    return errors;
  };
  return (
    <>
      <div className="login-form-container">
        <h3>Please Log In below</h3>
        <form action="" onSubmit={handleLogIn}>
          <div className="login-field">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              name="email"
              value={logIndetails.email}
              onChange={handleChange}
            />

            <p style={{ color: "red", fontWeight: "bold" }}>
              {logInErrors.email}
            </p>
          </div>

          <div className="login-field">
            <label htmlFor="password">Password :</label>
            <input
              type="password"
              name="password"
              value={logIndetails.password}
              onChange={handleChange}
            />

            <p style={{ color: "red", fontWeight: "bold" }}>
              {logInErrors.password}
            </p>
          </div>

          <button>Log In</button>

          <p style={{ color: "#ccc" }}>
            Do not have an account? Please{" "}
            <span
              onClick={goToSignUp}
              style={{
                color: "#007bff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Sign Up Here
            </span>
          </p>
        </form>
      </div>
    </>
  );
};

export default LogIn;
