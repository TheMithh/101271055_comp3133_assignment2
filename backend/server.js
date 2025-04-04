// server.js
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schemas/typeDefs');
const resolvers = require('./resolvers');
const connectDB = require('./config/db');
require('dotenv').config();

connectDB();

// Fix CORS configuration (it shouldn't be in .env file)
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ auth: req.headers.authorization }),
  cors: {
    origin: ['https://101271055-comp3133-assignment2.vercel.app', 'http://localhost:4200'],
    methods: ['POST', 'GET', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'apollo-require-preflight']
  }
});

// ONLY ONE server.listen call should be here
const PORT = process.env.PORT || 5000;
server.listen({ port: PORT, host: '0.0.0.0' }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`CORS enabled for: ${JSON.stringify(['https://101271055-comp3133-assignment2.vercel.app', 'http://localhost:4200'])}`);
});