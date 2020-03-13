import React from "react";
import ReactLoading from "react-loading";

function LoadingElement({ widthContainer, heightContainer, width, height }) {
  return (
    <div
      style={{
        width: widthContainer,
        height: heightContainer,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <ReactLoading
        type="spinningBubbles"
        color="lightblue"
        height={height}
        width={width}
      />
    </div>
  );
}

function LoadingView() {
  return (
    <LoadingElement
      widthContainer="100vw"
      heightContainer="100vh"
      width="10%"
      height="10%"
    />
  );
}

function LoadingContent() {
  return (
    <LoadingElement
      widthContainer="100%"
      heightContainer="100%"
      width="100%"
      height="100%"
    />
  );
}

export { LoadingView, LoadingContent };
