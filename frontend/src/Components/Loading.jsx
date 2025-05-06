import React from "react";
import SpinnerLoader from "./SpinnerLoader";

const Loading = () => {
  return (
    <>
      <div className="loading-page" style={{}}>
        <div>
          <h1>Loading...</h1>
          <SpinnerLoader />
        </div>
      </div>
    </>
  );
};

export default Loading;
