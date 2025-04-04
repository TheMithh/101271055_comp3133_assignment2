// server.js
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schemas/typeDefs');
const resolvers = require('./resolvers');
const connectDB = require('./config/db');
require('dotenv').config();

connectDB();

// In server.js or where your Apollo Server is configured
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ auth: req.headers.authorization }),
  cors: {
    origin: ['https://101271055-comp3133-assignment2.vercel.app', 'http://localhost:4200'],
    credentials: true
  }
});

server.listen({ port: process.env.PORT || 5000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
