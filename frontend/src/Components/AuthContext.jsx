// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { data } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userTag, setUserTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null); // will hold { username, userTag }
  const [signingOut, setSigningOut] = useState(false); // NEW
  const [tagLoading, setTagLoading] = useState(true); // NEW

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setTagLoading(true);
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserTag(data.userTag);
          setUsername(data.username);
        }
        setTagLoading(false);
      } else {
        setUserTag(null);
        setUsername(null);
        setTagLoading(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userTag,
        username,
        loading,
        tagLoading,
        signingOut,
        setSigningOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
