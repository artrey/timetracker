import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import moment from "moment";

import TimeInput from "../TimeInput";

import "./ActivityView.css";

export default function ActivityView({ sectors, hours = 0, minutes = 0 }) {
  return (
    <div className="card activity-card">
      <div className="card-header">
        <div className="row align-items-center">
          <div className="col-sm-7 col-12">
            <select className="custom-select">
              <option value="1">Бортник / Модель</option>
              <option value="2">Бортник / Инфраструктура</option>
              <option value="3">Бортник / Обсуждение</option>
              <option value="4">ОСА / Backend</option>
            </select>
          </div>
          <div className="col-sm-5 col-12">
            <TimeInput initialHour={hours} initialMinute={minutes} />
          </div>
        </div>
      </div>
      <div className="card-body">
        <textarea className="form-control"></textarea>
      </div>
    </div>
  );
}
