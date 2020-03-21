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
          fullName
        }
        hours
        minutes
        comment
      }
    }
  }
`;

export const UPDATE_WORK_DAY = gql`
  mutation UpdateWorkDay($day: Date!, $start: Time!, $finish: Time!) {
    updateWorkDay(day: $day, start: $start, finish: $finish) {
      workDay {
        id
        day
        start
        finish
        activities {
          id
          subsystem {
            id
            fullName
          }
          hours
          minutes
          comment
        }
      }
    }
  }
`;

export const UPDATE_ACTIVITY = gql`
  mutation UpdateWorkDay(
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
          fullName
        }
        hours
        minutes
        comment
      }
    }
  }
`;
