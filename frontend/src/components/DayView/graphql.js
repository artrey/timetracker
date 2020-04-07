import gql from "graphql-tag";

export const GET_WORK_DAY = gql`
  query WorkDay($day: Date!) {
    workDay(day: $day) {
      id
      day
      start
      finish
      activities {
        id
        subsystem {
          id
        }
        hours
        minutes
        comment
      }
    }
  }
`;

export const UPDATE_ACTIVITY = gql`
  mutation UpdateActivity(
    $workDay: UUID!
    $subsystem: UUID!
    $time: Time!
    $comment: String
    $uid: UUID
  ) {
    updateActivity(
      workDay: $workDay
      subsystem: $subsystem
      time: $time
      comment: $comment
      uid: $uid
    ) {
      activity {
        id
        subsystem {
          id
        }
        hours
        minutes
        comment
      }
    }
  }
`;

export const REMOVE_ACTIVITY = gql`
  mutation RemoveActivity($id: UUID!) {
    removeActivity(id: $id) {
      id
    }
  }
`;
