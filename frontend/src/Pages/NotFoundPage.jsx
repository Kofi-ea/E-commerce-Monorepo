import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <>
      <div className="not-found-page">
        <div>
          <FaExclamationTriangle
            style={{ color: "yellow", fontSize: "1.8rem" }}
          />
          <h1>404 Not Found</h1>
          <p>This page does not exist</p>
          <p>
            Go back to <Link to={"/"}>Homepage</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
