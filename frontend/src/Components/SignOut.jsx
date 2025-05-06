import React from "react";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { FaSignOutAlt } from "react-icons/fa";

const SignOut = () => {
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { setUserTag, setSigningOut } = useAuth();
  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOut(auth);
      navigate("/welcome");
      setUserTag(null);

      toast.success("Signed Out successfully");
    } catch (error) {
      console.log("Sign-out error", error.message);
      setSigningOut(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="signout-btn"
      >
        <span>Sign Out</span>
        <FaSignOutAlt style={{ widows: "18px", height: "18px" }} />
      </button>
    </div>
  );
};

export default SignOut;
