import gql from "graphql-tag";

export const SECTORS_GQL = gql`
  query Subsystems {
    subsystems {
      id
      fullName
    }
  }
`;

export const WEEK_GQL = gql`
  query Week($year: Int!, $week: Int!) {
    week(year: $year, week: $week) {
      firstDay
      days {
        day
        start
        finish
        activities {
          id
          hours
          minutes
          comment
          subsystem {
            id
            fullName
          }
        }
      }
    }
  }
`;
