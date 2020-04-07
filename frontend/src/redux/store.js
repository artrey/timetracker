import { WORK_DAY_TIME_CHANGED } from "./actions";

export default function reducer(state = {}, action) {
  switch (action.type) {
    case WORK_DAY_TIME_CHANGED:
      const { day, time } = action.payload;
      return {
        ...state,
        [day]: time,
      };
    default:
      return state;
  }
}
