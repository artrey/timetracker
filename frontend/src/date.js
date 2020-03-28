import moment from "moment";

export function firstDayOfWeek(year, week) {
  return moment()
    .isoWeekYear(year)
    .isoWeek(week)
    .startOf("isoWeek")
    .toDate();
}

export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
