import { gql } from "@apollo/client";

export const GET_CURRENT_USER = gql`
  query {
    currentUser {
      id
      username
      email
    }
  }
`;

export const GET_MY_NOTES = gql`
  query {
    getMyNotes {
      id
      title
      content
      createdAt
      updatedAt
    }
  }
`;