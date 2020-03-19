import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import moment from "moment";

import TimeInput from "../TimeInput";

import "./ActivityView.css";
import "../common.css";

export default function ActivityView({
  sectors,
  onRemove,
  hours = 0,
  minutes = 0
}) {
  const removeAction = () => {
    if (onRemove) {
      onRemove(0);
    }
  };

  return (
    <div className="card activity-card">
      <div className="card-header">
        <div className="row align-items-center justify-content-around">
          <select className="col-lg-6 col-10 custom-select">
            <option value="1">Бортник / Модель</option>
            <option value="2">Бортник / Инфраструктура</option>
            <option value="3">Бортник / Обсуждение</option>
            <option value="4">ОСА / Backend</option>
          </select>
          <div className="col-lg-5 col-12 order-lg-1 order-2 vertical-offset-lg">
            <TimeInput initialHour={hours} initialMinute={minutes} />
          </div>
          <button
            type="button"
            className="col-auto order-lg-2 order-1 btn btn-danger no-box-shadow"
            onClick={removeAction}
          >
            <b>✖</b>
          </button>
        </div>
      </div>
      <div className="card-body">
        <textarea className="form-control"></textarea>
      </div>
    </div>
  );
}
