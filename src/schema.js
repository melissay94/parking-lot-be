const { gql } = require('apollo-server-express');

module.exports = gql`
  type Query {
    currentUser: User
    lot(id: Int!): Lot
    lots: [Lot!]!
    entry(id: Int!): Entry
    entries: [Entry!]!
    comment(id: Int!): Comment
    comments: [Comment!]!
  }

  type Mutation {
    signup(name: String, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    editCurrentUser(name: String, email: String): AuthPayload
    editCurrentPassword(password: String!, newPassword: String!): AuthPayload
    createLot(name: String!, description: String): Lot
    joinLot(id: Int!, code: String!): Boolean
    editLot(id:Int!, name: String, description: String): Lot
    deleteLot(id: Int!): Boolean
    addEntryToLot(lotId: Int!, title: String!, description: String!, type: Int!): Entry
    editEntry(id: Int!, title: String, description: String): Entry
    deleteEntry(id: Int!): Boolean
    addCommentToEntry(entryId: Int!, text: String!): Comment
    editComment(id: Int!, text: String): Comment
    deleteComment(id: Int!): Boolean
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Comment {
    id: Int!
    text: String!
    entry: Entry
    user: User
  }

  type Entry {
    id: Int!
    title: String!
    description: String!
    type: Int!
    lot: Lot
    author: User
  }

  type Lot {
    id: Int!
    name: String!
    description: String
    code: String!
    author: User
  }

  type User {
    id: Int!
    name: String
    email: String!
    password: String!
    lots: [Lot!]!
    createdLots: [Lot!]!
    entries: [Entry!]!
    comments: [Comment!]!
  }
`;
