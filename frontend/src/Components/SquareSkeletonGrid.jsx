import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SquareSkeletonGrid = () => {
  const numberOfSquares = 20;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gap: "20px",
        // rowGap: "30px",
        // columnGap: "30px",
        marginTop: "40px",
      }}
    >
      {Array.from({ length: numberOfSquares }).map((_, index) => (
        <Skeleton key={index} width={500} height={500} />
      ))}
    </div>
  );
};

export default SquareSkeletonGrid;
