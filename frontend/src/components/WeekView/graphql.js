import gql from "graphql-tag";

export const GET_SUBSYSTEMS = gql`
  query Subsystems {
    subsystems {
      id
      fullName
    }
  }
`;
