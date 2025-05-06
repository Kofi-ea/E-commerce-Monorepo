import React, { useState } from "react";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const SignUp = ({ goToLogIn }) => {
  const userDetails = {
    username: "",
    email: "",
    password: "",
    userTag: "",
  };
  const [signUpDetails, setSignUpDetails] = useState(userDetails);
  const [signUpErrors, setSignUpErrors] = useState({});
  const [error, setError] = useState("");
  const [newUser, setNewUser] = useState(true);
  const signUp = () => {
    setNewUser(true);
  };

  const logs = () => {
    setNewUser(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSignUpDetails({ ...signUpDetails, [name]: value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const errors = validate(signUpDetails);
    setSignUpErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }
    console.log(signUpDetails);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signUpDetails.email,
        signUpDetails.password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: signUpDetails.username,
      });
      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: signUpDetails.username,
        email: signUpDetails.email,
        userTag: signUpDetails.userTag,
      });
      // Signed up successfully
      console.log("User signed up:", userCredential.user);

      toast.success("Signed Up successfully");
      setError(""); // Clear any previous errors
    } catch (error) {
      // Handle sign-up error
      console.error("Signup error:", error.code, error.message);
      setError(error.message);
      toast.error("You have already signed up with this email");
    }
  };

  const validate = (inputs) => {
    const errors = {};

    const regex = /^[\w\.-]+@[\w-]+\.[\w-]{2,}$/;

    if (!inputs.username) {
      errors.username = "Username is required";
    }

    if (!inputs.email) {
      errors.email = "Email is required";
    } else if (!regex.test(inputs.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!inputs.password) {
      errors.password = "Password is required";
    } else if (inputs.password.length < 6) {
      errors.password = "Password must contain more than 6 characters";
    } else if (inputs.password.length > 10) {
      errors.password = "Password must not contain more than 10 characters";
    }

    if (!inputs.userTag) {
      errors.userTag = "Select a user tag";
    }

    return errors;
  };
  return (
    <>
      <div className="signup-form-container">
        <h3>Welcome to the Fake Store App</h3>
        <form action="" onSubmit={handleSignUp}>
          <div className="signup-field">
            <label htmlFor="username" className="signup-field-label">
              Username :
            </label>
            <input
              type="text"
              name="username"
              value={signUpDetails.username}
              onChange={handleChange}
              className={`signup-field-input ${
                signUpErrors.username ? "signup-field-input-error" : ""
              } `}
            />

            <p style={{ color: "red" }}>{signUpErrors.username}</p>
          </div>

          <div className="signup-field">
            <label htmlFor="email" className="signup-field-label">
              Email :
            </label>
            <input
              type="email"
              name="email"
              value={signUpDetails.email}
              onChange={handleChange}
              className={`signup-field-input ${
                signUpErrors.email ? "signup-field-input-error" : ""
              } `}
            />

            <p style={{ color: "red" }}>{signUpErrors.email}</p>
          </div>

          <div className="signup-field">
            <label htmlFor="password" className="signup-field-label">
              Password :
            </label>
            <input
              type="password"
              name="password"
              value={signUpDetails.password}
              onChange={handleChange}
              className={`signup-field-input ${
                signUpErrors.password ? "signup-field-input-error" : ""
              } `}
            />

            <p style={{ color: "red" }}>{signUpErrors.password}</p>
          </div>

          <fieldset>
            <legend>User Tag</legend>
            <div className="radio-group">
              <div className="radio-option">
                <input
                  type="radio"
                  name="userTag"
                  id="customer"
                  value="customer"
                  checked={signUpDetails.userTag === "customer"}
                  onChange={handleChange}
                  className="radio-option"
                />
                <label htmlFor="customer">Customer</label>
              </div>

              <div className="radio-option">
                <input
                  type="radio"
                  name="userTag"
                  id="vendor"
                  value="vendor"
                  checked={signUpDetails.userTag === "vendor"}
                  onChange={handleChange}
                  className="radio-option"
                />
                <label htmlFor="vendor">Vendor</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  name="userTag"
                  id="store-manager"
                  value="store-manager"
                  checked={signUpDetails.userTag === "store-manager"}
                  onChange={handleChange}
                />
                <label htmlFor="store-manager" className="radio-option-label">
                  Store Manager
                </label>
              </div>
            </div>
            <p style={{ color: "red", marginTop: "5px" }}>
              {signUpErrors.userTag}
            </p>
          </fieldset>
          <button>Sign Up</button>

          <p style={{ color: "#ccc" }}>
            Already have an account?{" "}
            <span
              onClick={goToLogIn}
              style={{
                color: "#007bff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Login Here
            </span>
          </p>
        </form>
      </div>
    </>
  );
};

export default SignUp;
