import React from "react";

import UserView from "../UserView";

import "./CarouselUserView.css";
import "../common.css";

export default function CarouselUserView({
  onLeftClick,
  onRightClick,
  headerContent,
  additionalMenuItems,
  children
}) {
  const header = (
    <div className="row align-items-center justify-content-center">
      <div className="col-1">
        <button
          type="button"
          className="btn btn-light right-side"
          onClick={onLeftClick}
        >
          <span className="change-week">{"<"}</span>
        </button>
      </div>
      <div className="col-auto">{headerContent}</div>
      <div className="col-1">
        <button type="button" className="btn btn-light" onClick={onRightClick}>
          <span className="change-week">{">"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <UserView header={header} additionalMenuItems={additionalMenuItems}>
      {children}
    </UserView>
  );
}
