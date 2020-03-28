import gql from "graphql-tag";

export const GET_ME = gql`
  query Me {
    me {
      firstName
      lastName
      isSuperuser
    }
  }
`;
