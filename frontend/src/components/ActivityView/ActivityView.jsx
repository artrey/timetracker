import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import moment from "moment";

import TimeInput from "../TimeInput";

import "./ActivityView.css";
import "../common.css";

export default function ActivityView({
  subsystems,
  onRemove,
  subsystemId,
  comment,
  hours = 0,
  minutes = 0
}) {
  return (
    <div className="card activity-card">
      <div className="card-header">
        <div className="row align-items-center justify-content-around">
          <select className="col-lg-6 col-10 custom-select">
            {subsystems.map(s => (
              <option key={s.id} value={s.id} selected={s.id === subsystemId}>
                {s.fullName}
              </option>
            ))}
          </select>
          <div className="col-lg-5 col-12 order-lg-1 order-2 vertical-offset-lg">
            <TimeInput initialHour={hours} initialMinute={minutes} />
          </div>
          <button
            type="button"
            className="col-auto order-lg-2 order-1 btn btn-danger no-box-shadow"
            onClick={onRemove}
          >
            <b>✖</b>
          </button>
        </div>
      </div>
      <div className="card-body">
        <textarea className="form-control" value={comment}></textarea>
      </div>
    </div>
  );
}
