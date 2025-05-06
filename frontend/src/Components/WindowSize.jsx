import React from "react";
import { useState, useEffect } from "react";

const WindowSize = () => {
  const [windowScreenSize, setWindowScreenSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to update state on window resize
    const handleResize = () => {
      setWindowScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Add the event listener
    window.addEventListener("resize", handleResize);

    // Call handler immediately to set initial values
    handleResize();

    // Clean up the event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowScreenSize;
};

export default WindowSize;
