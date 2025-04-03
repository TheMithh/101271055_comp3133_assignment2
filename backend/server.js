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
    // Use environment variable for frontend URL in production
    origin: process.env.FRONTEND_URL ? 
      [process.env.FRONTEND_URL, 'http://localhost:4200'] : 
      ['http://localhost:4200']
  }
});

server.listen({ port: process.env.PORT || 5000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
