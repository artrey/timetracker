import React from "react";
import ReactLoading from "react-loading";

function LoadingElement({ containerWidth, containerHeight, ...rest }) {
  return (
    <div
      style={{
        width: containerWidth,
        height: containerHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <ReactLoading type="spinningBubbles" color="lightblue" {...rest} />
    </div>
  );
}

function LoadingView({ ...props }) {
  return (
    <LoadingElement containerWidth="100%" width="20%" height="20%" {...props} />
  );
}

function LoadingContent({ ...props }) {
  return (
    <LoadingElement containerWidth="100%" containerHeight="100%" {...props} />
  );
}

export { LoadingView, LoadingContent };
