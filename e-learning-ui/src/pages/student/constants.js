import moment from "moment";

export const convertTo12HourFormat = (timeVal) =>
  moment(timeVal, "HH:mm").format("h:mm A");
