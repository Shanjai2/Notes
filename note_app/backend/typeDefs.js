const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    role: String
    authProvider: String
  }

  type Note {
    id: ID!
    title: String!
    content: String!
    userId: ID!
    createdAt: String
    updatedAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    currentUser: User
    getMyNotes: [Note]
    getNoteById(id: ID!): Note
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    logout: String!

    createNote(title: String!, content: String!): Note
    updateNote(id: ID!, title: String!, content: String!): Note
    deleteNote(id: ID!): String
  }
`;

export default typeDefs;