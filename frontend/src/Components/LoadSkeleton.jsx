import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SquareSkeletonGrid from "./SquareSkeletonGrid";

const LoadSkeleton = () => {
  return (
    <div className="skeleton-load">
      <SkeletonTheme baseColor="#eee" highlightColor="#f5f5f5">
        <div>
          {/* Header skeleton */}
          <Skeleton
            height={500}
            width={"100%"}
            style={{ marginBottom: "70px" }}
          />

          {/* Content skeleton */}
          <Skeleton count={1} height={40} style={{ marginBottom: "10px" }} />

          <SquareSkeletonGrid />
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default LoadSkeleton;
