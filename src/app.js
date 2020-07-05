const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const typeDefs = require('./schema');
const models = require('../models');
const Query = require('./resolvers/Query');
const Comment = require('./resolvers/Comment');
const Entry = require('./resolvers/Entry');
const Lot = require('./resolvers/Lot');
const User = require('./resolvers/User');
const CommentMutation = require('./resolvers/CommentMutation');
const EntryMutation = require('./resolvers/EntryMutation');
const LotMutation = require('./resolvers/LotMutation');
const UserMutation = require('./resolvers/UserMutation');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors);

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null || token == "") {
    return next();
  }

  jwt.verify(token, process.env.APP_SECRET, (err, user) => {
    if (err) {
      res.sendStatus(403);
    }

    req.user = user;
    next();
  });
}

app.use(authenticate);

const resolvers = {
  Query,
  Mutation: {
    ...CommentMutation,
    ...EntryMutation,
    ...LotMutation,
    ...UserMutation
  },
  Comment,
  Entry,
  Lot,
  User
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {
      currentUser: req.user,
      models
    }
  }
});

server.applyMiddleware({ app });

models.sequelize.authenticate();
models.sequelize.sync();

app.listen({ port }, () => {
  console.log(`We're all mad here on port ${port}${server.graphqlPath}`);
});
