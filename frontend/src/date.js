import moment from "moment";

import { numberToTwoDigitsString } from "./utils";

export function firstDayOfWeek(year, week) {
  return moment().isoWeekYear(year).isoWeek(week).startOf("isoWeek").toDate();
}

export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function dayToTitle(day) {
  switch (day) {
    case 1:
      return "Понедельник";
    case 2:
      return "Вторник";
    case 3:
      return "Среда";
    case 4:
      return "Четверг";
    case 5:
      return "Пятница";
    case 6:
      return "Суббота";
    case 0:
      return "Воскресение";
    default:
      return "ВЫХОДНОЙ :)";
  }
}

export function dateToString(date) {
  return moment(date).format("YYYY-MM-DD");
}

export function minutesToString(minutes) {
  const hours = numberToTwoDigitsString(Math.floor(minutes / 60));
  minutes = numberToTwoDigitsString(minutes % 60);
  return `${hours}:${minutes}`;
}
